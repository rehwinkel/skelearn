use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Credentials {
    username: String,
    passwd: String,
}

async fn login(credentials: web::Json<Credentials>) -> impl Responder {
    println!("{:?}", credentials);
    HttpResponse::Ok().body("Yeehaw\n")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(web::scope("/api/v1").route("/login", web::post().to(login)))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
