import "./Login.scss";
import { apiLogin } from "../api";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "wouter";
import { useState } from "react";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

function Login() {
    let [loading, setLoading] = useState(false);
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    async function login(e: any) {
        e.preventDefault();
        setLoading(true);
        let response = await apiLogin(username, password);
        console.log(response);
        setLoading(false);
    }

    return (
        <div className="login-container">
            <Loading loading={loading} style={{ borderRadius: "16px" }}>
                <div className="login-content">
                    <span className="login-title">Login</span>
                    <Alert>You are bad</Alert>
                    <form onSubmit={login}>
                        <div className="login-form">
                            <Input placeholder="Username" type="text" onChanged={(e) => { setUsername(e.target.value) }} />
                            <Input placeholder="Password" type="password" onChanged={(e) => { setPassword(e.target.value) }} />
                            <div className="login-buttons">
                                <Link to="/register">
                                    <Button onClick={() => { }} inverted={true} style={{ width: "120px" }}>Register</Button>
                                </Link>
                                <Button type="submit" onClick={() => { }} style={{ width: "120px" }}>Login</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Loading>
        </div>
    );
}

export default Login;