import React, { ReactNode, useEffect, useState } from "react";
import { apiLogin, apiCheckToken } from "./api";
import useCookie from "react-use-cookie";
import Spinner from "./components/Spinner";

enum AuthResult {
    Ok,
    InvalidCreds,
    NoConnection,
}

interface Session {
    token: string,
}

interface AuthContextType<S> {
    session: S,
    signIn: (username: string, passwd: string) => Promise<AuthResult>,
    signOut: () => Promise<void>,
}

const AuthContext = React.createContext<AuthContextType<Session>>(null!);

function useAuth() {
    return React.useContext(AuthContext);
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [sessionCookie, setSessionCookie] = useCookie('session', "");
    let [session, setSession] = useState<Session>({ token: "" });
    let [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetch = async () => {
            let response = await apiCheckToken(sessionCookie);
            if (!response || !response.ok) {
                setSession({ token: "" });
                setSessionCookie("", { SameSite: "Strict" });
            } else {
                setSession({ token: sessionCookie });
            }
            setLoading(false);
        };
        fetch().catch();
    }, [sessionCookie]);

    let authProvider = {
        session: session,
        signIn: async (username: string, passwd: string) => {
            let response = await apiLogin(username, passwd);
            if (!response) {
                return AuthResult.NoConnection;
            } else if (response.ok) {
                let session_token = await response.text();
                let session: Session = { token: session_token };
                setSession(session);
                setSessionCookie(session_token, { SameSite: "Strict" });
                return AuthResult.Ok;
            } else {
                return AuthResult.InvalidCreds;
            }
        },
        signOut: async () => {
            setSession({ token: "" });
            setSessionCookie("", { SameSite: "Strict" });
        }
    };

    const loadingScreen = (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", height: "100vh" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "40px", marginBottom: "20px" }}>Loading...</span>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Spinner size="large"></Spinner></div>
            </div>
        </div>
    );

    return loading ? loadingScreen : <AuthContext.Provider value={authProvider}>{children}</AuthContext.Provider>;
}

function RequireAuth({ fallback, children }: { fallback: ReactNode, children: ReactNode }) {
    let auth = useAuth();

    return <div>{!auth.session.token ? fallback : children}</div>;

}

export { AuthResult, RequireAuth, AuthProvider, useAuth };