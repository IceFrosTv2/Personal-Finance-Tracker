import { CategoriesService } from "../../../services/categories-service";

export class BaseCategoriesEdit {
    constructor(openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;
        this.categoryId = new URLSearchParams(location.search).get('id');

        this.init().then()
    }

    async init() {
        const { title: categoryName } = await CategoriesService.getCategoriesByName(this.type, this.categoryId);

        document.getElementById('content__main').innerHTML = `
            <section class="container p-0">
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
        const input = document.getElementById('category-edit__input');
        const editButton = document.getElementById('category-edit__button');
        editButton.addEventListener('click', async () => {
            const result = await CategoriesService.updateCategory(this.type,this.categoryId, input.value);
            if ( result ) this.openNewRoute(`/categories/${this.type}`);
        })
    }
}
