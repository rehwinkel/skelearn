use std::time::{Duration, SystemTime, UNIX_EPOCH};

use actix_cors::Cors;
use actix_web::{
    web::{self, Data},
    App, HttpResponse, HttpServer,
};
use mongodb::{
    bson::{doc, to_document},
    options::{ClientOptions, IndexOptions},
    Client, Collection, Database, IndexModel,
};
use rand_chacha::rand_core::{RngCore, SeedableRng};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct Credentials {
    username: String,
    passwd: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Session {
    timestamp: u64,
    lifetime: u64,
    token: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct User {
    username: String,
    passwd_hash: String,
    sessions: Vec<Session>,
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
        let now_ms = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64;
        now_ms < self.timestamp + self.lifetime
    }
}

async fn register(db: &Database, creds: &Credentials) -> eyre::Result<bool> {
    let users: Collection<User> = db.collection("users");
    users
        .create_index(
            IndexModel::builder()
                .keys(doc! { "username": 1 })
                .options(IndexOptions::builder().unique(true).build())
                .build(),
            None,
        )
        .await?;
    let insert_result = users
        .insert_one(
            User {
                username: String::from(&creds.username),
                passwd_hash: bcrypt::hash(&creds.passwd, bcrypt::DEFAULT_COST)?,
                sessions: Vec::new(),
            },
            None,
        )
        .await;
    Ok(insert_result.is_ok())
}

async fn login(db: &Database, creds: &Credentials) -> eyre::Result<Option<String>> {
    let users: Collection<User> = db.collection("users");
    let user_opt = users
        .find_one(doc! { "username": &creds.username }, None)
        .await?;
    if let Some(user) = user_opt {
        if bcrypt::verify(&creds.passwd, &user.passwd_hash)? {
            let session = Session::new_random();
            users
                .update_one(
                    doc! { "username": &creds.username },
                    doc! { "$push": { "sessions": to_document(&session)? } },
                    None,
                )
                .await?;
            // TODO: delete old sessions
            Ok(Some(session.token))
        } else {
            Ok(None)
        }
    } else {
        Ok(None)
    }
}

async fn check_token(db: &Database, token: &String) -> eyre::Result<bool> {
    let users: Collection<User> = db.collection("users");
    let user_with_token = users
        .find_one(
            doc! { "sessions": doc!{ "$elemMatch": { "token": &token } } },
            None,
        )
        .await?;
    if let Some(user) = user_with_token {
        let session = user.sessions.iter().find(|s| &s.token == token).unwrap();
        Ok(session.is_valid())
    } else {
        Ok(false)
    }
}

async fn login_handler(db: Data<Database>, credentials: web::Json<Credentials>) -> HttpResponse {
    match login(&db, &credentials).await {
        Ok(token_opt) => {
            if let Some(token) = token_opt {
                HttpResponse::Ok().body(token)
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(e) => {
            eprintln!("Error while handling login: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn register_handler(db: Data<Database>, credentials: web::Json<Credentials>) -> HttpResponse {
    match register(&db, &credentials).await {
        Ok(result) => {
            if result {
                HttpResponse::Ok().finish()
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(e) => {
            eprintln!("Error while handling register: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn check_token_handler(db: Data<Database>, token: String) -> HttpResponse {
    match check_token(&db, &token).await {
        Ok(result) => {
            if result {
                HttpResponse::Ok().finish()
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
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
