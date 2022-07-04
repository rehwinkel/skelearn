import "./Login.scss";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import Alert from "../components/Alert";
import { AuthResult, useAuth } from "../auth";
import Card from "../components/Card";

function Login() { //Guten Tag
    let [_, setLocation] = useLocation();
    let auth = useAuth();
    let [loading, setLoading] = useState(false);
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [error, setError] = useState<string | null>(null);

    async function login(e: any) {
        e.preventDefault();
        setLoading(true);
        let result = await auth.signIn(username, password);
        setLoading(false);
        if (result === AuthResult.Ok) {
            setLocation("/dashboard", { replace: true });
        } else if (result === AuthResult.InvalidCreds) {
            setError("Invalid credentials");
        } else if (result === AuthResult.NoConnection) {
            setError("No connection");
        }
    }

    return (
        <Card loading={loading} style={{ width: "300px" }}>
            <div style={{ textAlign: "center" }}>
                <span className="card-title">Login</span>
            </div>
            {error === null ? null : <Alert>{error}</Alert>}
            <form onSubmit={login}>
                <div className="login-form">
                    <Input placeholder="Username" type="text" onChanged={(e) => { setUsername(e.target.value) }} />
                    <Input placeholder="Password" type="password" onChanged={(e) => { setPassword(e.target.value) }} />
                    <div className="login-buttons">
                        <Link to="/register">
                            <Button onClick={() => { }} inverted={true} >Register</Button>
                        </Link>
                        <Button type="submit" onClick={() => { }} >Login</Button>
                    </div>
                </div>
            </form>
        </Card>
    );
}

export default Login;