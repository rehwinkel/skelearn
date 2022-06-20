import "./Login.scss";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "wouter";
import { useState } from "react";

function Login() {
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");

    function login(e: any) {
        console.log(username, password)
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <span className="login-title">Login</span>
                <div className="login-form">
                    <Input placeholder="Username" type="text" onChanged={(e) => { setUsername(e.target.value) }} />
                    <Input placeholder="Password" type="password" onChanged={(e) => { setPassword(e.target.value) }} />
                    <div className="login-buttons">
                        <Link to="/register">
                            <Button onClick={() => { }} inverted={true} style={{ width: "120px" }}>Register</Button>
                        </Link>
                        <Button onClick={login} style={{ width: "120px" }}>Login</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;