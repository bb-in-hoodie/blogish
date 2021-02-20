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

export const USER_ID_MAX_LENGTH = 20;
export const USER_NICKNAME_MAX_LENGTH = 20;
