import config from "../config/config";

export class TokensUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';
    static rememberMeKey = 'rememberMe';

    static setAuthInfo (accessToken, refreshToken, userInfo = null, remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        localStorage.setItem(this.rememberMeKey, String(remember));

        storage.setItem(this.accessTokenKey, accessToken);
        storage.setItem(this.refreshTokenKey, refreshToken);
        if ( userInfo ) {
            storage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    static localOrStorage () {
        return localStorage.getItem(this.rememberMeKey) === 'true' ? localStorage : sessionStorage;
    }

    static getAuthInfo (key = null) {
        if ( key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key) ) {
            return this.localOrStorage().getItem(key);
        } else {
            const storage = this.localOrStorage();
            return {
                [this.accessTokenKey]: storage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: storage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: JSON.parse(storage.getItem(this.userInfoTokenKey)),
            }
        }
    }

    static async updateRefreshToken () {
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        if ( !refreshToken ) {
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
                body: JSON.stringify({ refreshToken })
            });
            if ( response.status === 200 ) {
                const { tokens } = await response.json();
                if ( tokens?.accessToken && tokens?.refreshToken ) {
                    const remember =localStorage.getItem(this.rememberMeKey) === 'true';
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken, null, remember);
                    return true;
                }
            } else if ( response.status === 400 || response.status === 401 ) {
                this.removeAuthInfo();
                return false;
            }
        } catch (e) {
            console.error('Failed to refresh token:', e)
            return false;
        }
        return false;
    }

    static removeAuthInfo () {
        this.localOrStorage().removeItem(this.accessTokenKey);
        this.localOrStorage().removeItem(this.refreshTokenKey);
        this.localOrStorage().removeItem(this.userInfoTokenKey);
        localStorage.removeItem(this.rememberMeKey);
    }
}
