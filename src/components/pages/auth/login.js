import { ValidatorForm } from "../../../utils/validator-form";
import { AuthService } from "../../../services/auth-service";
import { TokensUtils } from "../../../utils/tokens-utils";

export class Login {
    constructor (openNewRoute) {
        this.openNewRoute = openNewRoute
        const form = document.querySelector('.auth__inputs')
        const rules = {
            email: [
                {
                    regex: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: 'Enter valid email address'
                },
            ]
        }
        new ValidatorForm(form, rules, async (data) => {
            data.rememberMe = data.rememberMe === 'on';
            const loginResult = await AuthService.login(data)
            if ( loginResult ) {
                const { accessToken, refreshToken } = loginResult.tokens;
                const {name, lastName, id} = loginResult.user;
                TokensUtils.setAuthInfo(accessToken, refreshToken, {name, lastName, id}, data.rememberMe);
                this.openNewRoute('/');
            }
        });
    }
}
