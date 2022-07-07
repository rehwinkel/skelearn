import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import "./styles/test.scss";
import logo from "./logo.svg";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="test-class test-class-two">Hello There: <img width="100" src={logo} alt="logo" /></div>
    </React.StrictMode>
)