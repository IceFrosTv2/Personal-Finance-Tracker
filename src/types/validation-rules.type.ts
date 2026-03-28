export type ValidationRulesType = Record<string, ValidationRule[]>

type ValidationRule = {
    regex: (value: string) => boolean;
    message: string;
}
