import { CategoriesService } from "../../../services/categories-service";

export class BaseCategoriesCreate {
    constructor (openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;

        document.getElementById('content__main').innerHTML = `
            <section class="container">
                <h1 class="page-title">Create ${this.type} category</h1>
                <div class="category__create">
                    <input type="text" id="category-create__input" class="form-control" placeholder="Category name..." aria-label="Category name">
                    <div class="category__actions">
                        <button id="category-create__button" class="btn btn-success" type="button">Create</button>
                        <a href="/categories/${this.type}" class="btn btn-danger">Cancel</a>
                    </div>
                </div>
            </section>
        `
        const input = document.getElementById('category-create__input');
        const createButton = document.getElementById('category-create__button');
        createButton.addEventListener('click', async () => {
            const result = await CategoriesService.createCategory(this.type, input.value);
            if ( result ) this.openNewRoute(`/categories/${this.type}`);
        })
    }
}
