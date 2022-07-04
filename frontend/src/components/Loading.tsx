import "./Loading.scss";

import { CSSProperties, ReactNode } from "react";
import Spinner from "./Spinner";

function Loading({ loading, children, style }: { loading: boolean, children: ReactNode, style?: CSSProperties }) {
    if (loading) {
        return (
            <div className="loading-container">
                {children}
                <div className="loading-overlay" style={style}>
                    <div>
                        <Spinner size="small"></Spinner>
                        <div>Loading...</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <>{children}</>;
    }
}

export default Loading;