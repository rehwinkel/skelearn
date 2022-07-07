import './IconButton.scss'

import Icon from '@mdi/react'
import { mdiPlusThick } from '@mdi/js'

import colors from "../colors.module.scss";
import React from "react";
import { CSSProperties, MouseEvent } from 'react';

function IconButton({ style, inverted = false, color = "primary", size = "small", icon = mdiPlusThick, onClick }: { style?: CSSProperties, inverted?: boolean, color?: "accent" | "primary", size?: "small" | "large", icon?: string, onClick: (e: MouseEvent) => void }) {
    return (
        <button style={style} className={"icon-button-base icon-button-" + color + (inverted ? "-inverted" : "") + " icon-button-" + size} onClick={onClick}>
            <Icon size={size === "large" ? 1.333 : 1.08} path={icon} color={colors[color + (inverted ? "" : "-text") + "-color"]}></Icon>
        </button>
    );
}

export default IconButton;