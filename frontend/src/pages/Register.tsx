import { useState } from "react";
import { Link, useLocation } from "wouter";
import { apiRegister } from "../api";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import "./Register.scss";
import React from "react";
import { AuthResult, useAuth } from "../auth";

function Register() {
    let [_, setLocation] = useLocation();
    let [loading, setLoading] = useState(false);
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordRepeat, setPasswordRepeat] = useState("");
    let [error, setError] = useState<string | null>(null);
    let auth = useAuth();

    async function register(e: any) {
        e.preventDefault(); // to avoid page reload
        if (passwordRepeat !== password) {
            setError("Passwortwiederholung falsch!");
            return;
        }
        if (password.length < 8) {
            setError("Passwortlänge muss mind. 8 sein!");
            return;
        }
        setLoading(true);
        let response = await apiRegister(username, password);
        setLoading(false);
        if (!response) {
            setError("Keine Verbindung!");
        } else if (response.ok) {
            if (AuthResult.Ok === await auth.signIn(username, password)) {
                setLocation("/dashboard");
            } else {
                setError("Ein unerwarteter Fehler ist aufgetreten!");
            }
        } else {
            setError("Nutzername bereits vergeben!");
        }
    }

    return (
        <Card loading={loading} style={{ width: "300px" }}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Register</span>
            </div>
            {error === null ? null : <Alert>{error}</Alert>}
            <form onSubmit={register}>
                <div className="login-form">
                    <Input placeholder="Username" type="text" onChanged={(e) => { setError(null); setUsername(e.target.value) }} />
                    <Input placeholder="Password" type="password" onChanged={(e) => { setError(null); setPassword(e.target.value) }} />
                    <Input placeholder="Password (Wdh.)" type="password" onChanged={(e) => { setError(null); setPasswordRepeat(e.target.value) }} />
                    <div className="login-buttons">
                        <Link to="/login">
                            <Button onClick={() => { }} inverted={true}>Login</Button>
                        </Link>
                        <Button type="submit" onClick={() => { }} >Register</Button>
                    </div>
                </div>
            </form>
        </Card>
    );
}

export default Register;