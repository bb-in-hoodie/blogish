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
export type InputValidity = 'EMPTY' | 'VALID' | 'INVALID';
export type InputUniqueness = 'UNCHECKED' | 'UNIQUE' | 'NOT_UNIQUE';

export const USER_ID_MIN_LENGTH = 6;
export const USER_ID_MAX_LENGTH = 20;
export const USER_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export const USER_PASSWORD_MIN_LENGTH = 8;
export const USER_PASSWORD_MAX_LENGTH = 20;
export const USER_PASSWORD_REGEX = USER_ID_REGEX;

export const USER_NICKNAME_MIN_LENGTH = 2;
export const USER_NICKNAME_MAX_LENGTH = 20;
export const USER_NICKNAME_REGEX = USER_ID_REGEX;
