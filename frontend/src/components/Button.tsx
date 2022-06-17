import './Button.scss'
import { MouseEvent } from "react";

import colors from "../colors.module.scss";

interface ButtonProps {
    inverted?: boolean,
    color?: "accent" | "primary",
    size?: "small" | "large",
    children: string,
    onClick: (e: MouseEvent) => void,
}

function Button(props: ButtonProps) {
    let { inverted = false, color = "primary", size = "small" } = props;
    return (
        <button className={"button-base button-" + color + (inverted ? "-inverted" : "") + " button-" + size} onClick={props.onClick}>
            <div style={{ color: colors[color + (inverted ? "" : "-text") + "-color"] }}>{props.children}</div>
        </button>
    );
}

export default Button;