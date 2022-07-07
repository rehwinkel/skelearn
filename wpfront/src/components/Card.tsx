import "./Card.scss";

import { CSSProperties, ReactNode } from "react";
import Loading from "../components/Loading";
import React from "react";

function Card({ children, loading, style, outerStyle }: { children: ReactNode, loading?: boolean, style?: CSSProperties, outerStyle?: CSSProperties }) {
    return (
        <div className="card-container" style={{ width: "100%", ...outerStyle }}>
            <Loading loading={loading || false} outerStyle={(loading || false) ? style : undefined} overlayStyle={{ borderRadius: style?.borderRadius || "16px" }}>
                <div className="card-content" style={(loading || false) ? undefined : style}>
                    {children}
                </div>
            </Loading>
        </div>
    );
}

export default Card;