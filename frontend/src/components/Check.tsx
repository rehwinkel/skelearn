import { mdiCheck, mdiCheckboxBlank, mdiCheckboxBlankOutline, mdiCheckboxMarked } from "@mdi/js";
import Icon from "@mdi/react";
import { ReactNode, useState } from "react";
import "./Check.scss";
import colors from "../colors.module.scss";

function Check({ children, onToggle }: { children: ReactNode, onToggle: (selected: boolean) => void }) {
    let [selected, setSelected] = useState(false);
    let [hover, setHover] = useState(false);

    async function toggle() {
        onToggle(!selected);
        setSelected(!selected);
    }

    return (
        <div className="check-container" onClick={toggle} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>
            <Icon color={hover ? colors["primary-color-dark"] : colors["primary-color"]} size={1} path={selected ? mdiCheckboxMarked : mdiCheckboxBlankOutline}></Icon>
            <span className="check-text"> {children}</span>
        </div>
    );
}

export default Check;