import config from "../config/config";
import type {RefreshResponseType} from "../types/refresh-response.type";
import type {AuthInfoType, UserInfoType} from "../types/auth-info.type";

export class TokensUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';
    static rememberMeKey = 'rememberMe';

    public static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfoType | null, remember = false): void {
        const storage: Storage = remember ? localStorage : sessionStorage;
        localStorage.setItem(this.rememberMeKey, String(remember));

        storage.setItem(this.accessTokenKey, accessToken);
        storage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            storage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    private static localOrSession(): Storage {
        return localStorage.getItem(this.rememberMeKey) === 'true' ? localStorage : sessionStorage;
    }

    public static getAuthInfo(key: string): string | null;
    public static getAuthInfo(): AuthInfoType;
    public static getAuthInfo(key?: string | null): string | null | AuthInfoType {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return this.localOrSession().getItem(key);
        } else {
            const storage: Storage = this.localOrSession();
            return {
                accessToken: storage.getItem(this.accessTokenKey),
                refreshToken: storage.getItem(this.refreshTokenKey),
                userInfo: JSON.parse(storage.getItem(this.userInfoTokenKey) ?? 'null') as UserInfoType || null,
            }
        }
    }

    public static async updateRefreshToken(): Promise<boolean> {
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if (!refreshToken) {
            this.removeAuthInfo();
            return false
        }

        try {
            const response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken})
            });
            if (response.status === 200) {
                const {tokens}: RefreshResponseType = await response.json();
                if (tokens.accessToken && tokens.refreshToken) {
                    const remember = localStorage.getItem(this.rememberMeKey) === 'true';
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken, null, remember);
                    return true;
                }
            } else if (response.status === 400 || response.status === 401) {
                this.removeAuthInfo();
                return false;
            }
        } catch (e) {
            console.error('Failed to refresh token:', e)
            return false;
        }
        return false;
    }

    public static removeAuthInfo(): void {
        this.localOrSession().removeItem(this.accessTokenKey);
        this.localOrSession().removeItem(this.refreshTokenKey);
        this.localOrSession().removeItem(this.userInfoTokenKey);
        localStorage.removeItem(this.rememberMeKey);
    }
}
