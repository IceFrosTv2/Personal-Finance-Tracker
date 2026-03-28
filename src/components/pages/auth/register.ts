import { ValidatorForm } from "../../../utils/validator-form";
import { AuthService } from "../../../services/auth-service";
import type {OpenNewRouteType} from "../../../types/open-new-route.type";
import type {ValidationRulesType} from "../../../types/validation-rules.type";
import type {FormDataType} from "../../../types/form-data.type";
import type {RegisterResponseType} from "../../../types/auth-response.type";

export class Register {
    constructor (private openNewRoute: OpenNewRouteType) {
        const form: HTMLFormElement | null = document.querySelector('.auth__inputs');
        if (!form) return;

        const rules: ValidationRulesType = {
            name: [
                {
                    regex: (value) => /^[A-Z]/.test(value),
                    message: 'Name must start with a capital letter'
                },
                {
                    regex: (value) => /^[A-Za-z\s]+$/.test(value),
                    message: 'Name must contain only English letters'
                },
            ],
            lastName: [
                {
                    regex: (value) => /^[A-Z]/.test(value),
                    message: 'Lastname must start with a capital letter'
                },
                {
                    regex: (value) => /^[A-Za-z\s]+$/.test(value),
                    message: 'Lastname must contain only English letters'
                },
            ],
            email: [
                {
                    regex: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                    message: 'Enter valid email address'
                },
            ],
            password: [
                {
                    regex: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value),
                    message: 'Password: at least 8 characters, with uppercase, lowercase, and a number.'
                }
            ],
            passwordRepeat: [
                {
                    regex: (value) => {
                        const passwordInput: HTMLInputElement | null = document.querySelector('[data-validate="password"]');
                        if (!passwordInput) return false;
                        return value === passwordInput.value
                    },
                    message: 'Passwords do not match'
                }
            ],
        }
        new ValidatorForm(form, rules, async (data: FormDataType): Promise<void> => {
            const registerResult: RegisterResponseType | null = await AuthService.register(data);
            if ( registerResult ) await this.openNewRoute('/login');
        });
    }

}
