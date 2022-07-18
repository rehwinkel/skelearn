declare const API_URL: string;

function isString(x: any) {
    return Object.prototype.toString.call(x) === "[object String]";
}

function request(method: string, path: string, headers: any, body?: any) {
    return fetch(API_URL + path, { method: method, mode: "cors", headers: { "Content-Type": "application/json", ...headers }, body: body !== undefined ? (isString(body) ? body : JSON.stringify(body)) : undefined });
}

function post(path: string, headers: any, body?: any): Promise<Response> {
    return request("POST", path, headers, body);
}

function get(path: string, headers: any, body?: any): Promise<Response> {
    return request("GET", path, headers, body);
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
    let response: Response;
    try {
        response = await post("/token", {}, token);
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

async function apiSubmitResult({ correct, wrong, slow }: { correct: Array<string>, wrong: Array<string>, slow: Array<string> }, token: string): Promise<Response | null> {
    let response: Response;
    try {
        response = await post("/submitResult", {}, { correct, wrong, slow, token });
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

async function apiGetResults(token: string): Promise<Response | null> {
    let response: Response;
    try {
        response = await post("/results", {}, token);
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

async function apiResetResults(token: string): Promise<Response | null> {
    let response: Response;
    try {
        response = await post("/resetResults", {}, token);
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

interface AnatomyElement {
    name: string,
    key: string,
    description: string,
    tip: string,
    img: any,
    imgPosX: number,
    imgPosY: number,
    radius: number,
    selectionRadius: number,
    examModes: Array<"img" | "text">,
}

async function apiGetAnatomy(): Promise<Response | null> {
    let response: Response;
    try {
        response = await get("/anatomy", {});
        return response;
    } catch (err: any) {
        console.error(err);
        return null;
    }
}

interface Category {
    name: string,
    key: string,
    elements: Array<string>,
}

async function apiGetCategories(): Promise<Array<Category>> {
    return [
        {
            name: "Alle Knochen",
            key: "all",
            elements: [
                "vertebrae_cervicales", "sternum", "os_cuboideum", "os_cuneiforme_laterale",
                "os_hamatum", "viscerocranium", "columna_vertebralis", "os_sacrum", "fibula",
                "stapes", "ulna", "calcaneus", "partella", "os_lacrimale", "os_femoris",
                "os_ilium", "axis", "humerus", "os_scaphoideum", "scapula", "maxilla",
                "os_nasale", "os_occipitale", "talus", "os_lunatum", "os_trapezoideum",
                "vomer", "vertebrae_lumbales", "radius", "os_zygomatikum", "incus", "atlas",
                "neurocranium", "os_parietale", "ossa_metacarpi", "digitus_phalanx_distalis",
                "mandibular", "costae", "cranium", "os_pubis", "os_ischii", "digitus_phalanx_media",
                "os_trapezium", "os_ethmoidale", "digitus_pedis_phalanx_distalis", "malleus",
                "os_pisiforme", "digitus_phalanx_proximalis", "os_cuneiforme_mediale",
                "tibia", "os_hyoideum", "os_coccygi", "digitus_pedis_phalanx_media",
                "os_frontale", "os_temporale", "cingulum_membri_superioris", "os_triquetrum",
                "os_coxae", "os_sphenoidale", "os_capitatum", "vertebrae_thoracice",
                "os_naviculare", "digitus_pedis_phalanx_proximalis", "os_cuneiforme_intermedium",
                "clavicula", "carpus", "ossa_metatarsi"
            ]
        }
    ];
}

export {
    apiLogin,
    apiRegister,
    apiCheckToken,
    apiSubmitResult,
    apiGetResults,
    apiResetResults,
    apiGetAnatomy,
    apiGetCategories
};