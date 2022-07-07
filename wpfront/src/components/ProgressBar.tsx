import "./ProgressBar.scss";
import React from "react";

function ProgressBar({ progress, color }: { progress: number, color?: string }) {
    let percent = Math.min(100, Math.round((progress || 0) * 100));
    let hue = Math.round((percent / 100.0) * 120.0);
    let rightSideRounded = percent > 1;
    let rightRadius = rightSideRounded ? "8px" : "0";
    return (
        <div className="progbar-container">
            <div className="progbar-background"></div>
            <div className="progbar-foreground" style={{ backgroundColor: color || ("hsl(" + hue + ", 80%, 60%)"), width: percent + "%", borderTopRightRadius: rightRadius, borderBottomRightRadius: rightRadius }}></div>
        </div>
    );
}

export default ProgressBar;