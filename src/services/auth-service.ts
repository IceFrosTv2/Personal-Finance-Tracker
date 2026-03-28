import { HttpUtils } from "../utils/http-utils";
import { ToastUtils } from "../utils/toast-utils";
import { TokensUtils } from "../utils/tokens-utils";
import type {FormDataType} from "../types/form-data.type";
import type {LoginResponseType, RegisterResponseType} from "../types/auth-response.type";

export class AuthService {
    static async register (data: FormDataType): Promise<RegisterResponseType | null> {
        const result = await HttpUtils.request('/signup', 'POST', false, data);
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response as RegisterResponseType ?? null;
    }

    static async login (data: FormDataType): Promise<LoginResponseType | null> {
        const result = await HttpUtils.request('/login', 'POST', false, data)
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response as LoginResponseType ?? null;
    }

    static async logout(): Promise<void> {
        const refreshToken = TokensUtils.getAuthInfo(TokensUtils.refreshTokenKey);
        if (!refreshToken) return;
        await HttpUtils.request('/logout', 'POST', false, {refreshToken});
        TokensUtils.removeAuthInfo();
    }
}
