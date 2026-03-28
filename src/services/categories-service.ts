import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";
import type {CategoryType} from "../types/category.type";
import type {ApiResponseType} from "../types/http-response.type";

export class CategoriesService {
    static async getCategories(category: string): Promise<CategoryType[] | null> {
        const result = await HttpUtils.request(`/categories/${category}`, 'GET', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as CategoryType[];
    }

    static async getCategoriesById(category: string, categoryId: string): Promise<CategoryType | null> {
        const result = await HttpUtils.request(`/categories/${category}/${categoryId}`, 'GET', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as CategoryType;
    }

    static async createCategory(category: string, categoryName: string): Promise<CategoryType | null> {
        const result = await HttpUtils.request(`/categories/${category}`, 'POST', true, {title: categoryName});
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as CategoryType;
    }

    static async updateCategory(category: string, categoryId: string, categoryName: string): Promise<CategoryType | null> {
        const result = await HttpUtils.request(`/categories/${category}/${categoryId}`, 'PUT', true, {title: categoryName});
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as CategoryType;
    }

    static async deleteCategory(category: string, categoryId: string): Promise<ApiResponseType | null> {
        const result = await HttpUtils.request(`/categories/${category}/${categoryId}`, 'DELETE', true);
        if (ToastUtils.checkAndShowError(result)) return null;
        return result.response as ApiResponseType;
    }
}
