import { ChangeEvent, CSSProperties, useState } from "react";
import "./Input.scss";

interface InputProps {
    placeholder?: string,
    type?: "text" | "password"
    style?: CSSProperties,
    onChanged: (e: ChangeEvent<HTMLInputElement>) => void,
}

function Input(props: InputProps) {
    let [accessed, setAccessed] = useState(false);
    let { type = "text" } = props;

    return (
        <div className="container" style={props.style}>
            {props.placeholder ? <span className={"placeholder" + (accessed ? " placeholder-moved" : "")}>{props.placeholder}</span> : null}
            <input type={type} className="input-field"
                onFocus={() => {
                    setAccessed(true);
                }}
                onBlur={(e) => {
                    setAccessed(!!e.target.value);
                }}
                onChange={props.onChanged}
            />
        </div>
    );
}

export default Input;