import {CategoriesService} from "../../../services/categories-service";
import type {OpenNewRouteType} from "../../../types/open-new-route.type";
import type {OperationTypeEnum} from "../../../types/operation-type.enum";

export class BaseCategoriesCreate {
    constructor(private openNewRoute: OpenNewRouteType, private type: OperationTypeEnum) {

        const contentMain = document.getElementById('content__main')
        if (!contentMain) return;
        contentMain.innerHTML = `
            <section class="container">
                <h1 class="page-title">Create ${this.type} category</h1>
                <div class="category__create">
                    <input type="text" id="category-create__input" class="form-control" 
                    placeholder="Category name..." aria-label="Category name">
                    <div class="category__actions">
                        <button id="category-create__button" class="btn btn-success" type="button">Create</button>
                        <a href="/categories/${this.type}" class="btn btn-danger">Cancel</a>
                    </div>
                </div>
            </section>
        `
        const input = document.getElementById('category-create__input') as HTMLInputElement;
        const createButton = document.getElementById('category-create__button') as HTMLButtonElement;
        createButton.addEventListener('click', async () => {
            const result = await CategoriesService.createCategory(this.type, input.value);
            if (result) await this.openNewRoute(`/categories/${this.type}`);
        })
    }
}
