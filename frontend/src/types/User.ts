export default interface User {
    userId: string;
    nickname: string;
    password?: string;
    deleted?: boolean;
}
