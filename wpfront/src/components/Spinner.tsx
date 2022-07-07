import "./Spinner.scss";
import React from "react";

function Spinner({ size }: { size: "small" | "large" }) {
    return (
        <div className={"lds-spinner spinner-size-" + size}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}

export default Spinner;