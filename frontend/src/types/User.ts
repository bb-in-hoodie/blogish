export default interface User {
    userId: string;
    nickname: string;
    password?: string;
}

export interface LoginResult {
    succeeded: boolean;
    user?: User;
}

export type UserToDelete = Pick<User, 'userId' | 'password'>;

export const USER_ID_MAX_LENGTH = 20;
export const USER_NICKNAME_MAX_LENGTH = 20;
