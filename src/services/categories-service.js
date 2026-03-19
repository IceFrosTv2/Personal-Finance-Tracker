import { HttpUtils } from "../utils/http-utils";
import { ToastUtils } from "../utils/toast-utils";

export class CategoriesService {
    static async getCategories (category) {
        const result = await HttpUtils.request(`/categories/${category}`, 'GET', true);
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }

    static async getCategoriesByName (category, categoryId) {
        const result = await HttpUtils.request(`/categories/${category}/${categoryId}`, 'GET', true);
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }

    static async createCategory (category, categoryName) {
        const result = await HttpUtils.request(`/categories/${category}`, 'POST', true, { title: categoryName });
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }

    static async updateCategory (category, categoryId, categoryName) {
        const result = await HttpUtils.request(`/categories/${category}/${categoryId}`, 'PUT', true, { title: categoryName });
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }

    static async deleteCategory (category, categoryId) {
        const result = await HttpUtils.request(`/categories/${category}/${categoryId}`, 'DELETE', true);
        if ( ToastUtils.checkAndShowError(result) ) return null;
        return result.response;
    }
}
