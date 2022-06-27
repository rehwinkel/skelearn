import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "../auth";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
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
        <div className="login-container">
            <Loading loading={loading} style={{ borderRadius: "16px" }}>
                <div className="login-content">
                    <span className="login-title">Register</span>
                    {error === null ? null : <Alert>{error}</Alert>}
                    <form onSubmit={register}>
                        <div className="login-form">
                            <Input placeholder="Username" type="text" onChanged={(e) => { setUsername(e.target.value) }} />
                            <Input placeholder="Password" type="password" onChanged={(e) => { setPassword(e.target.value) }} />
                            <Input placeholder="Password (Wdh.)" type="password" onChanged={(e) => { setPasswordRepeat(e.target.value) }} />
                            <div className="login-buttons">
                                <Link to="/login">
                                    <Button onClick={() => { }} inverted={true} style={{ width: "120px" }}>Login</Button>
                                </Link>
                                <Button type="submit" onClick={() => { }} style={{ width: "120px" }}>Register</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Loading>
        </div>
    );
}

export default Register;