use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use mongodb::{options::ClientOptions, Client, Collection};
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

async fn login(credentials: web::Json<Credentials>) -> impl Responder {
    println!("{:?}", credentials);
    HttpResponse::Ok().body("Yeehaw\n")
}

#[actix_web::main]
async fn main() -> eyre::Result<()> {
    let client_opts = ClientOptions::parse("mongodb://127.0.0.1:27017").await?;
    let client = Client::with_options(client_opts)?;
    let db = client.database("skelearn");
    let users: Collection<User> = db.collection("users");
    users
        .insert_one(
            User {
                username: String::from("ian"),
                passwd_hash: bcrypt::hash("123", bcrypt::DEFAULT_COST)?,
            },
            None,
        )
        .await?;

    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(web::scope("/api/v1").route("/login", web::post().to(login)))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await?;
    Ok(())
}
