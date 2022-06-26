use actix_cors::Cors;
use actix_web::{
    web::{self, Data},
    App, HttpResponse, HttpServer, Responder, Result,
};
use mongodb::{options::ClientOptions, Client, Collection, Database};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct Credentials {
    username: String,
    passwd: String,
}

#[derive(Serialize, Deserialize)]
struct User {
    username: String,
    passwd_hash: String,
}

async fn login(db: &Database, creds: &Credentials) -> eyre::Result<()> {
    let users: Collection<User> = db.collection("users");
    println!("{:?}", creds);
    // users.find_one(filter, options)
    users
        .insert_one(
            User {
                username: String::from("ian"),
                passwd_hash: bcrypt::hash("123", bcrypt::DEFAULT_COST)?,
            },
            None,
        )
        .await?;
    Ok(())
}

async fn login_handler(db: Data<Database>, credentials: web::Json<Credentials>) -> HttpResponse {
    println!("wrhwhwrh");
    match login(&db, &credentials).await {
        Ok(_) => HttpResponse::Ok().body("1816351093"),
        Err(e) => {
            eprintln!("Error while handling login: {}", e);
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
            .service(web::scope("/api/v1").route("/login", web::post().to(login_handler)))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await?;
    Ok(())
}
