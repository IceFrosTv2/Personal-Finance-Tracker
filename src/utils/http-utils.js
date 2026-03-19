import { TokensUtils } from "./tokens-utils";
import config from "../config/config";

export class HttpUtils {
    static async request (url, method = 'GET', useAuth = true, body = null) {

        const params = {
            method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            },
        };
        if ( useAuth ) {
            const token = TokensUtils.getAuthInfo(TokensUtils.accessTokenKey);
            if ( token ) {
                params.headers['x-auth-token'] = token;
            }
        }

        if ( body ) {
            params.body = JSON.stringify(body)
        }

        try {
            const response = await fetch(config.api + url, params);

            let json;
            try {
                json = await response.json();
            } catch (e) {
                json = null;
            }

            if ( response.status < 200 || response.status >= 300 ) {
                if ( useAuth && response.status === 401 ) {
                    // 2 tokens are old or invalid
                    const result = await TokensUtils.updateRefreshToken();

                    if ( result ) {
                        // request again
                        return this.request(url, method, useAuth, body)
                    }

                    return {
                        error: true
                    }
                }
                return {
                    error: true,
                    status:response.status,
                    response: json,
                };
            }

            return {
                error: false,
                response: json,
            };
        } catch (e) {
            return {
                error: true,
                response: null
            }
        }
    }
}
