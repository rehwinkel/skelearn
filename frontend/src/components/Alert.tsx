import "./Alert.scss";
import { mdiAlertCircleOutline } from "@mdi/js";
import colors from "../colors.module.scss";
import Icon from "@mdi/react";
import { PropsWithChildren } from "react";

function Alert(props: PropsWithChildren) {
    return (
        <div className="alert-container">
            <Icon path={mdiAlertCircleOutline} size={1} color={colors["error-color"]} />
            <span className="alert-text">{props.children}</span>
        </div>
    );
}

export default Alert;