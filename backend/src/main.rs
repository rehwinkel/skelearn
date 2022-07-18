use std::{
    collections::HashMap,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

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
use serde::{de::Visitor, ser::SerializeSeq, Deserialize, Serialize};

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

#[derive(Debug, Serialize, Deserialize)]
struct ExamResults {
    timestamp: u64,
    correct: Vec<String>,
    wrong: Vec<String>,
    slow: Vec<String>,
}

#[derive(Deserialize, Debug)]
struct ResultSubmission {
    token: String,
    correct: Vec<String>,
    wrong: Vec<String>,
    slow: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct User {
    username: String,
    passwd_hash: String,
    sessions: Vec<Session>,
    results: Vec<ExamResults>,
}

#[derive(Debug, PartialEq, Eq)]
enum AnatomicExamMode {
    Text,
    Image,
    TextImage,
    None,
}

impl Serialize for AnatomicExamMode {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let len = match self {
            Self::Text | Self::Image => 1,
            Self::TextImage => 2,
            _ => 0,
        };
        let mut seq = serializer.serialize_seq(Some(len))?;
        if self == &Self::Text || self == &Self::TextImage {
            seq.serialize_element("text")?;
        }
        if self == &Self::Image || self == &Self::TextImage {
            seq.serialize_element("img")?;
        }
        seq.end()
    }
}

struct ExamModeVisitor;

impl<'de> Visitor<'de> for ExamModeVisitor {
    type Value = AnatomicExamMode;

    fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
        formatter.write_str("a list of up to two strings, containg \"img\" and/or \"text\"")
    }

    fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
    where
        A: serde::de::SeqAccess<'de>,
    {
        struct ChildVisitor;

        impl<'dec> Visitor<'dec> for ChildVisitor {
            type Value = u8;

            fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
                formatter.write_str("either \"img\" or \"text\"")
            }

            fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
            where
                E: serde::de::Error,
            {
                Ok(match v {
                    "text" => 1,
                    "img" => 2,
                    _ => 0,
                })
            }
        }

        let mut text = false;
        let mut img = false;

        while let Some(el) = seq.next_element::<&str>()? {
            if el == "text" {
                text = true;
            }
            if el == "img" {
                img = true;
            }
        }
        Ok(match (text, img) {
            (true, true) => AnatomicExamMode::TextImage,
            (true, false) => AnatomicExamMode::Text,
            (false, true) => AnatomicExamMode::Image,
            (false, false) => AnatomicExamMode::None,
        })
    }
}

impl<'de> Deserialize<'de> for AnatomicExamMode {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        deserializer.deserialize_any(ExamModeVisitor)
    }
}

#[derive(Serialize, Deserialize, Debug)]
struct AnatomicStructure {
    #[serde(rename = "imgPosX")]
    img_pos_x: u64,
    #[serde(rename = "imgPosY")]
    img_pos_y: u64,
    #[serde(rename = "selectionRadius")]
    selection_radius: u64,
    radius: u64,
    img: String,
    name: String,
    key: String,
    description: String,
    #[serde(rename = "examModes")]
    exam_modes: AnatomicExamMode,
    tip: String,
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
                results: Vec::new(),
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
            let old_sessions: Vec<&str> = user
                .sessions
                .iter()
                .filter(|s| !s.is_valid())
                .map(|s| s.token.as_str())
                .collect();
            users
                .update_one(
                    doc! { "username": &creds.username },
                    doc! {
                        "$pull": { "sessions": { "token": { "$in": old_sessions } } }
                    },
                    None,
                )
                .await?;
            users
                .update_one(
                    doc! { "username": &creds.username },
                    doc! {
                        "$push": { "sessions": to_document(&session)? },
                    },
                    None,
                )
                .await?;
            Ok(Some(session.token))
        } else {
            Ok(None)
        }
    } else {
        Ok(None)
    }
}

async fn check_token(db: &Database, token: &String) -> eyre::Result<Option<User>> {
    let users: Collection<User> = db.collection("users");
    let user_with_token = users
        .find_one(
            doc! { "sessions": doc!{ "$elemMatch": { "token": &token } } },
            None,
        )
        .await?;
    if let Some(user) = user_with_token {
        let session = user.sessions.iter().find(|s| &s.token == token).unwrap();
        Ok(if session.is_valid() { Some(user) } else { None })
    } else {
        Ok(None)
    }
}

async fn submit_result(db: &Database, submission: &ResultSubmission) -> eyre::Result<bool> {
    let results = ExamResults {
        correct: submission.correct.clone(),
        wrong: submission.wrong.clone(),
        slow: submission.slow.clone(),
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis() as u64,
    };
    let users: Collection<User> = db.collection("users");
    let token = &submission.token;
    if let Some(user) = check_token(db, token).await? {
        users
            .update_one(
                doc! { "username": &user.username },
                doc! { "$push": { "results": to_document(&results)? } },
                None,
            )
            .await?;
        Ok(true)
    } else {
        Ok(false)
    }
}

async fn reset_results(db: &Database, token: &String) -> eyre::Result<bool> {
    let users: Collection<User> = db.collection("users");
    if let Some(user) = check_token(db, token).await? {
        users
            .update_one(
                doc! { "username": &user.username },
                doc! { "$set": { "results": [] } },
                None,
            )
            .await?;
        Ok(true)
    } else {
        Ok(false)
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct ResultSummary {
    total_score: f64,
    scores: HashMap<String, f64>,
}

async fn get_results(db: &Database, token: &String) -> eyre::Result<Option<ResultSummary>> {
    if let Some(user) = check_token(db, token).await? {
        let result_list;
        if user.results.len() > 10 {
            result_list = &user.results[user.results.len() - 10..]
        } else {
            result_list = &user.results;
        }
        let mut total_correct = 0;
        let mut total_tested = 0;
        let mut scores_correct = HashMap::new();
        let mut scores_tested = HashMap::new();
        for results in result_list {
            for elem in &results.correct {
                let old_score: u64 = if let Some(old_score) = scores_correct.get(&elem) {
                    *old_score
                } else {
                    0
                };
                scores_correct.insert(elem, old_score + 1);
            }
            for result_kind in [&results.correct, &results.slow, &results.wrong] {
                for elem in result_kind {
                    let old_score: u64 = if let Some(old_score) = scores_tested.get(&elem) {
                        *old_score
                    } else {
                        0
                    };
                    scores_tested.insert(elem, old_score + 1);
                }
            }
            total_correct += results.correct.len();
            total_tested += results.correct.len();
            total_tested += results.slow.len();
            total_tested += results.wrong.len();
        }
        let total = total_correct as f64 / total_tested as f64;
        let scores: HashMap<String, f64> = scores_tested
            .iter()
            .map(|(&elem, score)| {
                (
                    elem.clone(),
                    *scores_correct.get(elem).unwrap_or(&0) as f64 / *score as f64,
                )
            })
            .collect();
        Ok(Some(ResultSummary {
            total_score: total,
            scores,
        }))
    } else {
        Ok(None)
    }
}

async fn login_handler(data: Data<AppData>, credentials: web::Json<Credentials>) -> HttpResponse {
    match login(&data.db, &credentials).await {
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

async fn register_handler(
    data: Data<AppData>,
    credentials: web::Json<Credentials>,
) -> HttpResponse {
    match register(&data.db, &credentials).await {
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

async fn check_token_handler(data: Data<AppData>, token: String) -> HttpResponse {
    match check_token(&data.db, &token).await {
        Ok(result) => {
            if result.is_some() {
                HttpResponse::Ok().finish()
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(e) => {
            eprintln!("Error while handling check token: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn submit_result_handler(
    data: Data<AppData>,
    submission: web::Json<ResultSubmission>,
) -> HttpResponse {
    match submit_result(&data.db, &submission).await {
        Ok(result) => {
            if result {
                HttpResponse::Ok().finish()
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(e) => {
            eprintln!("Error while handling submit results: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn reset_results_handler(data: Data<AppData>, token: String) -> HttpResponse {
    match reset_results(&data.db, &token).await {
        Ok(result) => {
            if result {
                HttpResponse::Ok().finish()
            } else {
                HttpResponse::Unauthorized().finish()
            }
        }
        Err(e) => {
            eprintln!("Error while handling submit results: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn results_handler(data: Data<AppData>, token: String) -> HttpResponse {
    match get_results(&data.db, &token).await {
        Ok(Some(result)) => HttpResponse::Ok().body(serde_json::to_string(&result).unwrap()),
        Ok(None) => HttpResponse::Unauthorized().finish(),
        Err(e) => {
            eprintln!("Error while handling get results: {:?}", e);
            HttpResponse::InternalServerError().body("Internal Server Error")
        }
    }
}

async fn anatomy_handler(data: Data<AppData>) -> HttpResponse {
    HttpResponse::Ok().body(serde_json::to_string(&data.data).unwrap())
}

struct AppData {
    db: Database,
    data: Vec<AnatomicStructure>,
}

#[actix_web::main]
async fn main() -> eyre::Result<()> {
    let data_json = include_str!("data.json");
    let data: Vec<AnatomicStructure> = serde_json::from_str(data_json)?;

    let url = std::env::var("MONGO_URL").unwrap_or(String::from("mongodb://127.0.0.1:27017"));
    println!("Server started at '{}'!", url);
    let client_opts = ClientOptions::parse(url).await?;
    let client = Client::with_options(client_opts)?;
    let db = client.database("skelearn");
    let db_data = Data::new(AppData { db, data });

    HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .wrap(Cors::permissive())
            .service(
                web::scope("/api/v1")
                    .route("/login", web::post().to(login_handler))
                    .route("/register", web::post().to(register_handler))
                    .route("/token", web::post().to(check_token_handler))
                    .route("/submitResult", web::post().to(submit_result_handler))
                    .route("/resetResults", web::post().to(reset_results_handler))
                    .route("/results", web::post().to(results_handler))
                    .route("/anatomy", web::get().to(anatomy_handler)),
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await?;
    Ok(())
}
