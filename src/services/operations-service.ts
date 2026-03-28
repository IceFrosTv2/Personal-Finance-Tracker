import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";
import type {ApiResponseType, HttpResponseType} from "../types/http-response.type";
import type {CreateOrUpdateOperation, OperationsType} from "../types/operations.type";

export class OperationsService {
    public static async getTodayOperations(): Promise<OperationsType[] | null> {
        const result: HttpResponseType = await HttpUtils.request(`/operations`, 'GET', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as OperationsType[];
    }

    public static async getOperationsWithFilter(dateFrom: Date | null, dateTo: Date | null): Promise<OperationsType[] | null> {
        if (!dateFrom || !dateTo) return null;
        const from = dateFrom.toISOString().split('T')[0];
        const to = dateTo.toISOString().split('T')[0];
        const result: HttpResponseType = await HttpUtils.request(`/operations?period=interval&dateFrom=${from}&dateTo=${to}`, 'GET', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as OperationsType[];
    }

    public static async getAllOperations(): Promise<OperationsType[] | null> {
        const result = await HttpUtils.request('/operations?period=all', 'GET', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as OperationsType[];
    }

    public static async getOperationById(operationId: string): Promise<OperationsType | null> {
        const result = await HttpUtils.request(`/operations/${operationId}`, 'GET', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as OperationsType;
    }

    public static async createOperation(data: CreateOrUpdateOperation): Promise<OperationsType | null> {
        const result = await HttpUtils.request(`/operations`, 'POST', true, data);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as OperationsType;
    }

    public static async updateOperation(operationId: string, data: CreateOrUpdateOperation): Promise<OperationsType | null> {
        const result = await HttpUtils.request(`/operations/${operationId}`, 'PUT', true, data);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as OperationsType;
    }

    public static async deleteOperation(operationId: string): Promise<ApiResponseType | null> {
        const result = await HttpUtils.request(`/operations/${operationId}`, 'DELETE', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as ApiResponseType;
    }
}
