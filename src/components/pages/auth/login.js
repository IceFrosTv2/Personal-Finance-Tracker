import { ValidatorForm } from "../../../utils/validator-form";
import { AuthService } from "../../../services/auth-service";

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
        new ValidatorForm(form, rules, (data) => {
            AuthService.login(data)
        });
    }
}
