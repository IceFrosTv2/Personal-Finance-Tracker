export type AuthInfoType = {
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: UserInfoType | null;
}

export type UserInfoType = {
    name: string,
    lastName: string,
    id: number,
}
