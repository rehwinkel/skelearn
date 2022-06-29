import "./Card.scss";

import { CSSProperties, ReactNode } from "react";
import Loading from "../components/Loading";

function Card({ children, loading, style }: { children: ReactNode, loading: boolean, style?: CSSProperties }) {
    return (
        <div className="card-container">
            <Loading loading={loading} style={{ borderRadius: style?.borderRadius || "16px" }}>
                <div className="card-content" style={style}>
                    {children}
                </div>
            </Loading>
        </div>
    );
}

export default Card;