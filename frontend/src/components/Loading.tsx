import "./Loading.scss";

import { CSSProperties, PropsWithChildren } from "react";
import Spinner from "./Spinner";

interface LoadingProps {
    loading: boolean,
    style?: CSSProperties
}

function Loading(props: PropsWithChildren<LoadingProps>) {
    if (props.loading) {
        return (
            <div className="loading-container">
                {props.children}
                <div className="loading-overlay" style={props.style}>
                    <div>
                        <Spinner size="small"></Spinner>
                        <div>Loading...</div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <>{props.children}</>;
    }
}

export default Loading;