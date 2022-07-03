import "./Card.scss";

import { CSSProperties, ReactNode } from "react";
import Loading from "../components/Loading";

function Card({ children, loading, style, outerStyle }: { children: ReactNode, loading?: boolean, style?: CSSProperties, outerStyle?: CSSProperties }) {
    return (
        <div className="card-container" style={outerStyle}>
            <Loading loading={loading || false} style={{ borderRadius: style?.borderRadius || "16px" }}>
                <div className="card-content" style={style}>
                    {children}
                </div>
            </Loading>
        </div>
    );
}

export default Card;