FROM rust:1.62-slim-buster

WORKDIR /server

COPY Cargo.toml Cargo.lock ./
COPY src/ ./src/
RUN cargo install --path .

EXPOSE 8080

CMD ["server"]