import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../auth";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import "./Register.scss";

function Register() {
    let auth = useAuth();
    let [loading, setLoading] = useState(false);
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [passwordRepeat, setPasswordRepeat] = useState("");
    let [error, setError] = useState<string | null>(null);

    async function register(e: any) {
        e.preventDefault();
    }

    return (
        <Card loading={loading} style={{ width: "300px" }}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Register</span>
            </div>
            {error === null ? null : <Alert>{error}</Alert>}
            <form onSubmit={register}>
                <div className="login-form">
                    <Input placeholder="Username" type="text" onChanged={(e) => { setUsername(e.target.value) }} />
                    <Input placeholder="Password" type="password" onChanged={(e) => { setPassword(e.target.value) }} />
                    <Input placeholder="Password (Wdh.)" type="password" onChanged={(e) => { setPasswordRepeat(e.target.value) }} />
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