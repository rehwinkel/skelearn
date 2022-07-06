import goofySkeleton from "./goofy-skeleton.png";
import accurateSkeleton from "./accurate-skeleton.png";

const endpoint = "http://localhost:8080/api/v1";

function post(path: string, headers: any, body?: any): Promise<Response> {
    return fetch(endpoint + path, { method: "POST", mode: "cors", headers: { "Content-Type": "application/json", ...headers }, body: body !== undefined ? JSON.stringify(body) : undefined });
}

function get(path: string, headers: any): Promise<Response> {
    return fetch(endpoint + path, { method: "GET", mode: "cors", headers: { "Content-Type": "application/json", ...headers } });
}

async function hashPasswd(passwd: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(passwd);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

async function apiLogin(username: string, passwd: string): Promise<Response | null> {
    let response: Response;
    try {
        response = await post("/login", {}, { username, passwd: await hashPasswd(passwd) });
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

async function apiRegister(username: string, passwd: string): Promise<Response | null> {
    let response: Response;
    try {
        response = await post("/register", {}, { username, passwd: await hashPasswd(passwd) });
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

interface AnatomyElement {
    name: string,
    description: string,
    tip: string,
    img: any,
    imgPosX: number,
    imgPosY: number,
    radius: number,
    selectionRadius: number,
    examModes: Array<"img" | "text">,
}

async function apiGetAnatomy(): Promise<Array<AnatomyElement>> {
    return [{
        imgPosX: 777,
        imgPosY: 431,
        selectionRadius: 35,
        radius: 90,
        img: goofySkeleton,
        name: "Nasenknochen",
        examModes: ["img", "text"],
        description: "Der Nasenknochen ist ein nonexistenter Knochen in der Nase.",
        tip: "Die Nase ist im Gesicht"
    }, {
        imgPosX: 1332,
        imgPosY: 974,
        selectionRadius: 80,
        radius: 160,
        img: goofySkeleton,
        name: "Handknochen",
        examModes: ["img", "text"],
        description: "Der Hand ist ein nonexistenter Knochen in der Nase.",
        tip: "Die Hand ist im Gesicht"
    }, {
        imgPosX: 730,
        imgPosY: 1130,
        selectionRadius: 60,
        radius: 125,
        img: accurateSkeleton,
        name: "Femur",
        examModes: ["text"],
        description: "Der Femur ist im Leg.",
        tip: "Femur ist halt Oberschenkel."
    }];
}

interface Category {
    name: string,
    elements: Array<string>,
}

async function apiGetCategories(): Promise<Array<Category>> {
    return [
        {
            name: "Hauptknochen",
            elements: ["Femur", "Handknochen", "Nasenknochen"]
        }
    ];
}

export {
    apiLogin,
    apiRegister,
    apiCheckToken,
    apiGetAnatomy,
    apiGetCategories
};