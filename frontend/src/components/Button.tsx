import './Button.scss'

import colors from "../colors.module.scss";

interface ButtonProps {
    inverted?: boolean,
    color?: "accent" | "primary",
    size?: "small" | "large",
    children: string,
}

function Button(props: ButtonProps) {
    let { inverted = false, color = "primary", size = "small" } = props;
    // <Icon size={size === "large" ? 1.333 : 1} path={mdiPlusThick} color={colors[color + (inverted ? "" : "-text") + "-color"]}></Icon>
    return (
        <button className={"button-base button-" + color + (inverted ? "-inverted" : "") + " button-" + size}>
            <div style={{ color: colors[color + (inverted ? "" : "-text") + "-color"] }}>{props.children}</div>
        </button>
    );
}

export default Button;