export default interface User {
    userId: string;
    nickname: string;
    password?: string;
    deleted?: boolean;
}

export interface LoginResult {
    succeeded: boolean;
    user?: User;
}
