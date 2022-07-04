import "./Loading.scss";

import { CSSProperties, ReactNode } from "react";
import Spinner from "./Spinner";

function Loading({ loading, children, outerStyle, overlayStyle }: { loading: boolean, children: ReactNode, outerStyle?: CSSProperties, overlayStyle?: CSSProperties }) {
    if (loading) {
        return (
            <div className="loading-container" style={outerStyle}>
                {children}
                <div className="loading-overlay" style={overlayStyle}>
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