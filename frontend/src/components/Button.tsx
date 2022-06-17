import './Button.scss'
import { CSSProperties, MouseEvent } from "react";

import colors from "../colors.module.scss";

interface ButtonProps {
    inverted?: boolean,
    color?: "accent" | "primary",
    size?: "small" | "large",
    style?: CSSProperties,
    children: string,
    onClick: (e: MouseEvent) => void,
}

function Button(props: ButtonProps) {
    let { inverted = false, color = "primary", size = "small" } = props;
    return (
        <button className={"button-base button-" + color + (inverted ? "-inverted" : "") + " button-" + size} style={props.style} onClick={props.onClick}>
            <div style={{ flexGrow: 1, color: colors[color + (inverted ? "" : "-text") + "-color"] }}>{props.children}</div>
        </button>
    );
}

export default Button;