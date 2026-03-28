export type HttpResponseType = {
    error: boolean;
    status?: number;
    response: unknown;
}

export type ApiResponseType = {
    error: boolean;
    message: string;
}
