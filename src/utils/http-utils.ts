import { TokensUtils } from "./tokens-utils";
import config from "../config/config";
import type {HttpResponseType} from "../types/http-response.type";

export class HttpUtils {
    public static async request (
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        useAuth: boolean = true,
        body: Record<string, unknown> | null = null,
    ): Promise<HttpResponseType> {

        const params: {method: string, headers: Record<string, string>, body?: string} = {
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

            let json: unknown;
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
                    location.href = '/login';
                    return {
                        error: true,
                        response: json,
                    }
                }
                return {
                    error: true,
                    status: response.status,
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
