use std::{
    error::Error,
    fmt::Display,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use actix_cors::Cors;
use actix_web::{
    web::{self, Data},
    App, HttpResponse, HttpServer,
};
use mongodb::{bson::doc, options::ClientOptions, Client, Collection, Database};
use rand_chacha::rand_core::{RngCore, SeedableRng};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct Credentials {
    username: String,
    passwd: String,
}

#[derive(Serialize, Deserialize)]
struct Session {
    timestamp: u64,
    lifetime: u64,
    token: String,
}

impl Session {
    fn new_random() -> Self {
        let timestamp = SystemTime::now();
        let lifetime = Duration::from_secs(3600 * 2);
        let mut token: [u8; 64] = [0; 64];
        let mut rng = rand_chacha::ChaCha20Rng::from_entropy();
        rng.fill_bytes(&mut token);
        Session {
            timestamp: timestamp.duration_since(UNIX_EPOCH).unwrap().as_millis() as u64,
            lifetime: lifetime.as_millis() as u64,
            token: hex::encode(&token),
        }
    }

    fn is_valid(&self) -> bool {
        let timestamp = UNIX_EPOCH
            .checked_add(Duration::from_millis(self.timestamp))
            .unwrap();
        let now = SystemTime::now();
        let lifetime = Duration::from_millis(self.lifetime);
        timestamp.checked_add(lifetime).unwrap() < now
    }
}

#[derive(Serialize, Deserialize)]
struct User {
    username: String,
    passwd_hash: String,
    sessions: Vec<Session>,
}

#[derive(Debug)]
enum AppError {
    UsernameTaken,
    InvalidCredentials,
    InvalidToken,
}

impl Error for AppError {}

impl Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

async fn register(db: &Database, creds: &Credentials) -> eyre::Result<()> {
    let users: Collection<User> = db.collection("users");
    let existing_user = users
        .find_one(doc! { "username": &creds.username }, None)
        .await?;
    if existing_user.is_none() {
        users
            .insert_one(
                User {
                    username: String::from(&creds.username),
                    passwd_hash: bcrypt::hash(&creds.passwd, bcrypt::DEFAULT_COST)?,
                    sessions: Vec::new(),
                },
                None,
            )
            .await?;
        Ok(())
    } else {
        Err(AppError::UsernameTaken.into())
    }
}

async fn login(db: &Database, creds: &Credentials) -> eyre::Result<String> {
    // TODO: delete old sessions
    let users: Collection<User> = db.collection("users");
    let user_opt = users
        .find_one(doc! { "username": &creds.username }, None)
        .await?;
    if let Some(mut user) = user_opt {
        if bcrypt::verify(&creds.passwd, &user.passwd_hash)? {
            let session = Session::new_random();
            let token = session.token.clone();
            user.sessions.push(session);
            users.insert_one(user, None).await?;
            Ok(token)
        } else {
            Err(AppError::InvalidCredentials.into())
        }
    } else {
        Err(AppError::InvalidCredentials.into())
    }
}

async fn check_token(db: &Database, token: &String) -> eyre::Result<()> {
    let users: Collection<User> = db.collection("users");
    let user_with_token = users
        .find_one(
            doc! {"sessions": doc!{"$elemMatch": doc!{"token": &token}}},
            None,
        )
        .await?;
    if let Some(user) = user_with_token {
        let session = user.sessions.iter().find(|s| &s.token == token).unwrap();
        if session.is_valid() {
            Ok(())
        } else {
            Err(AppError::InvalidToken.into())
        }
    } else {
        Err(AppError::InvalidToken.into())
    }
}

async fn login_handler(db: Data<Database>, credentials: web::Json<Credentials>) -> HttpResponse {
    match login(&db, &credentials).await {
        Ok(token) => HttpResponse::Ok().body(token),
        Err(e) => {
            eprintln!("Error while handling login: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn register_handler(db: Data<Database>, credentials: web::Json<Credentials>) -> HttpResponse {
    match register(&db, &credentials).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => {
            eprintln!("Error while handling register: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn check_token_handler(db: Data<Database>, token: String) -> HttpResponse {
    match check_token(&db, &token).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => {
            eprintln!("Error while handling register: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

#[actix_web::main]
async fn main() -> eyre::Result<()> {
    let client_opts = ClientOptions::parse("mongodb://127.0.0.1:27017").await?;
    let client = Client::with_options(client_opts)?;
    let db = client.database("skelearn");
    let db_data = Data::new(db);

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .wrap(Cors::permissive())
            .service(
                web::scope("/api/v1")
                    .route("/login", web::post().to(login_handler))
                    .route("/register", web::post().to(register_handler))
                    .route("/token", web::post().to(check_token_handler)),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await?;
    Ok(())
}
