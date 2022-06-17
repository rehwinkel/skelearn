import Icon from '@mdi/react'
import { mdiPlusThick } from '@mdi/js'

import './IconButton.scss'

import colors from "../colors.module.scss";

interface IconButtonProps {
    inverted?: boolean,
    color?: "accent" | "primary",
    size?: "small" | "large"
    icon?: string
}

function IconButton(props: IconButtonProps) {
    let { inverted = false, color = "primary", size = "small", icon = mdiPlusThick } = props;
    return (
        <button className={"icon-button-base icon-button-" + color + (inverted ? "-inverted" : "") + " icon-button-" + size}>
            <Icon size={size === "large" ? 1.333 : 1} path={icon} color={colors[color + (inverted ? "" : "-text") + "-color"]}></Icon>
        </button>
    );
}

export default IconButton;