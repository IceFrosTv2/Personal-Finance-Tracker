export class ValidatorForm {
    constructor (form, customRules = {}, onSuccess = null) {
        this.rules = customRules;
        this.validity = {}
        this.inputs = document.querySelectorAll('[data-validate]')

        this.inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        })

        form.addEventListener('submit', e => {
            this.inputs.forEach(input => this.validateInput(input))
            if ( !Object.values(this.validity).every(value => value) ) {
                e.preventDefault();
            } else if ( onSuccess ) {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(form))
                onSuccess(data);
            }
        })
    }

    validateInput (input) {
        const dataName = input.dataset.validate
        const errorMessage = input.closest('.input-group').querySelector('.invalid-feedback')
        this.validity[dataName] = true;
        if ( !input.value ) {
            errorMessage.innerText = input.dataset.label
            this.validity[dataName] = false;
        } else {
            for ( const rule of (this.rules[dataName] || []) ) {
                if ( !rule.regex(input.value) ) {
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
