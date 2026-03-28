import {CategoriesService} from "../../../services/categories-service";
import type {OpenNewRouteType} from "../../../types/open-new-route.type";
import type {OperationTypeEnum} from "../../../types/operation-type.enum";

export class BaseCategoriesEdit {
    private readonly categoryId!: string;

    constructor(private openNewRoute: OpenNewRouteType, private type: OperationTypeEnum) {
        this.categoryId = new URLSearchParams(location.search).get('id') as string;
        if (!this.categoryId) return;

        this.init().then()
    }

    private async init(): Promise<void> {
        const category = await CategoriesService.getCategoriesById(this.type, this.categoryId);
        if (!category) return;
        const {title: categoryName} = category;

        const contentMain = document.getElementById('content__main')
        if (!contentMain) return;
        contentMain.innerHTML = `
            <section class="container">
                <h1 class="page-title">Edit ${this.type} category</h1>
                <div class="category__edit">
                    <input type="text" id="category-edit__input" class="form-control" 
                    placeholder="Category name..." value="${categoryName}" aria-label="Category name">
                    <div class="category__actions">
                        <button id="category-edit__button" class="btn btn-success" type="button">Save</button>
                        <a href="/categories/${this.type}" class="btn btn-danger">Cancel</a>
                    </div>
                </div>
            </section>
        `
        const input = document.getElementById('category-edit__input') as HTMLInputElement;
        const editButton = document.getElementById('category-edit__button') as HTMLButtonElement;
        editButton.addEventListener('click', async () => {
            const result = await CategoriesService.updateCategory(this.type, this.categoryId, input.value);
            if (result) await this.openNewRoute(`/categories/${this.type}`);
        })
    }
}
