import {ValidatorForm} from "../../../utils/validator-form";
import {AuthService} from "../../../services/auth-service";
import {TokensUtils} from "../../../utils/tokens-utils";
import type {OpenNewRouteType} from "../../../types/open-new-route.type";
import type {ValidationRulesType} from "../../../types/validation-rules.type";
import type {LoginResponseType} from "../../../types/auth-response.type";
import type {FormDataType} from "../../../types/form-data.type";

export class Login {
    constructor(private readonly openNewRoute: OpenNewRouteType) {
        const form: HTMLFormElement | null = document.querySelector('.auth__inputs');
        if (!form) return;

        const rules: ValidationRulesType = {
            email: [
                {
                    regex: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: 'Enter valid email address'
                },
            ]
        }
        new ValidatorForm(form, rules, async (data: FormDataType): Promise<void> => {
            const rememberMe = data.rememberMe === 'on';
            const loginResult: LoginResponseType | null = await AuthService.login({...data, rememberMe});
            if (loginResult) {
                const {accessToken, refreshToken} = loginResult.tokens;
                const {name, lastName, id} = loginResult.user;
                TokensUtils.setAuthInfo(accessToken, refreshToken, {name, lastName, id}, rememberMe);
                await this.openNewRoute('/');
            }
        });
    }
}
