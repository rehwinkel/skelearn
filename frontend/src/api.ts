const endpoint = "http://localhost:8080/api/v1";

function post(path: string, headers: any, body?: any): Promise<Response> {
    return fetch(endpoint + path, { method: "POST", mode: "cors", headers: { "Content-Type": "application/json", ...headers }, body: body !== undefined ? JSON.stringify(body) : undefined });
}

function get(path: string, headers: any): Promise<Response> {
    return fetch(endpoint + path, { method: "GET", mode: "cors", headers: { "Content-Type": "application/json", ...headers } });
}

async function apiLogin(username: string, passwd: string): Promise<Response | null> {
    const encoder = new TextEncoder();
    const data = encoder.encode(passwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    let response: Response;
    try {
        response = await post("/login", {}, { username, passwd: hashHex });
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

async function apiCheckToken(token: string) {
    await new Promise(r => setTimeout(r, 500));
    return true;
}

export {
    apiLogin,
    apiCheckToken,
};