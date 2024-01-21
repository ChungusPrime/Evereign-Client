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
    message: string;
    success: boolean;
    userid: number | undefined;
    username: string | undefined;
    classes: { name: string, description: string, starting: string }[] | undefined;
    factions: { name: string, description: string }[] | undefined;
    races: { name: string, description: string }[] | undefined;
    servers: { name: string, address: string, players: string, status: string }[] | undefined;
}

interface RegisterResponse {
    message: string;
    success: boolean;
}