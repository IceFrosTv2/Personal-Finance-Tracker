import type {ValidationRulesType} from "../types/validation-rules.type";
import type {FormDataType} from "../types/form-data.type";

export class ValidatorForm {
    private inputs: NodeListOf<HTMLInputElement>;
    private readonly validity: Record<string, boolean> = {}

    constructor(
        form: HTMLFormElement,
        private rules: ValidationRulesType = {},
        onSuccess: ((data: FormDataType) => void) | null = null,
    ) {
        this.inputs = document.querySelectorAll('[data-validate]')

        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        })

        form.addEventListener('submit', e => {
            this.inputs.forEach(input => this.validateInput(input))
            if (!Object.values(this.validity).every(value => value)) {
                e.preventDefault();
            } else if (onSuccess) {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form))
                onSuccess(data);
            }
        })
    }

    private validateInput(input: HTMLInputElement): void {
        const dataName = input.dataset.validate
        const group = input.closest('.input-group');
        if (!group || !dataName) return;

        const errorMessage = group.querySelector('.invalid-feedback') as HTMLElement | null;
        if (!errorMessage) return;

        this.validity[dataName] = true;
        if (!input.value) {
            errorMessage.innerText = input.dataset.label ?? ''
            this.validity[dataName] = false;
        } else {
            for (const rule of (this.rules[dataName] ?? [])) {
                if (!rule.regex(input.value)) {
                    errorMessage.innerText = rule.message;
                    this.validity[dataName] = false;
                    break;
                }
            }
        }
        input.classList.toggle('is-invalid', !this.validity[dataName]);
        input.classList.toggle('is-valid', this.validity[dataName]);
    }
}
