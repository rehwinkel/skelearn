use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct Greeting {
    a: u64,
    b: String,
}

async fn hello(greeting: web::Json<Greeting>) -> impl Responder {
    println!("{:?}", greeting);
    HttpResponse::Ok().body("Yeehaw\n")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().route("/hello", web::post().to(hello)))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
