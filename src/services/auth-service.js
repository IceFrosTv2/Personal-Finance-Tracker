import { HttpUtils } from "../utils/http-utils";
import { ToastUtils } from "../utils/toast-utils";
import { TokensUtils } from "../utils/tokens-utils";

export class AuthService {
    static async register (data) {
        const result = await HttpUtils.request('/signup', 'POST', false, data);
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }

    static async login (data) {
        const result = await HttpUtils.request('/login', 'POST', false, data)
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }

    static async logout() {
        const refreshToken = TokensUtils.getAuthInfo(TokensUtils.refreshTokenKey);
        await HttpUtils.request('/logout', 'POST', false, {refreshToken});
        TokensUtils.removeAuthInfo();
    }
}
