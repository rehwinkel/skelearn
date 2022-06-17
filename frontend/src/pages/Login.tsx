import "./Login.scss";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Input from "../components/Input";

function Login() {
    function login(e: any) { }

    return (
        <div>
            Login
            <Input placeholder="Username" />
            <div className="login-buttons">
                <Link to="/register">
                    <Button onClick={() => { }} inverted={true} style={{ width: "120px" }}>Register</Button>
                </Link>
                <Button onClick={login} style={{ width: "120px" }}>Login</Button>
            </div>
        </div>
    );
}

export default Login;