declare module "*.jpg" {
    const path: string;
    export default path;
}

declare module "*.png" {
    const path: string;
    export default path;
}

declare module "*.json" {
    const path: any;
    export default path;
}

declare module "*.mp3" {
    const path: any;
    export default path;
}

declare module "*.html" {
    const path: string;
    export default path;
}

interface LoginResponse {
    sessionid: number;
    classes: any;
    races: any;
    message: string;
    success: boolean;
    userid: number | undefined;
    username: string | undefined;
    realms: { name: string, address: string, players: string, status: string }[];
}

interface RegisterResponse {
    message: string;
    success: boolean;
}

interface GameServerResponse {
    success: boolean;
    characters: { id: string, name: string, level: string }[];
}