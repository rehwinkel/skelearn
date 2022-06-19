import { CSSProperties, useState } from "react";
import "./Input.scss";

interface InputProps {
    placeholder?: string,
    style?: CSSProperties,
}

function Input(props: InputProps) {
    let [accessed, setAccessed] = useState(false);

    return (
        <div className="container" style={props.style}>
            {props.placeholder ? <span className={"placeholder" + (accessed ? " placeholder-moved" : "")}>{props.placeholder}</span> : null}
            <input className="input-field"
                onFocus={() => {
                    setAccessed(true);
                }} onBlur={(e) => {
                    setAccessed(!!e.target.value);
                }} />
        </div>
    );
}

export default Input;