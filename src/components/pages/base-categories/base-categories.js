import * as bootstrap from 'bootstrap';
import { CategoriesService } from "../../../services/categories-service";

export class BaseCategories {
    constructor (openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;
        this.init().then();
    }

    async init () {
        this.renderLayout();

        // Находим карточки товаров, чтобы повесить ОДНУ прослушку на всё
        this.categories = document.getElementById("categories");
        this.modalInstance = new bootstrap.Modal(document.getElementById("category-modal"));

        const result = await CategoriesService.getCategories(this.type);
        if ( result ) this.renderCategories(result);

        this.initEventListeners();
    }

    renderLayout () {
        document.getElementById('content__main').innerHTML = `
        <section class="container p-0">
            <header class="page-title">${this.type.toUpperCase()}</header>
            <div id="categories" class="categories"></div>
            <div class="modal fade" id="category-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <span id="modal-text" class="modal-text">
                            Are you sure you want to delete this category? Related income will remain uncategorized.
                        </span>
                        <div class="modal-buttons">
                            <button id="modal-confirm" type="button" class="btn btn-danger">
                                Delete
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
    }

    renderCategories (categories) {
        for ( const category of categories ) {
            this.categories.appendChild(this.createCategoryCard(category));
        }
        this.categories.insertAdjacentHTML('beforeend', '<button id="category-add-button" class="category-card" type="button">+</button>');
    }

    createCategoryCard (category) {
        const article = document.createElement("article");
        article.id = category.id;
        article.className = "category-card";
        // article.dataset.categoryName = category.title;

        const h3 = document.createElement("h3");
        h3.className = "category-card__title";
        h3.textContent = category.title;
        article.appendChild(h3);

        article.insertAdjacentHTML('beforeend', `
                            <div>
                                <a href="/categories/${this.type}/edit?id=${category.id}" class="btn btn-primary">
                                    Edit</a>
                                <button class="btn btn-danger" type="button" data-action="delete">
                                    Delete</button>
                            </div>
                `);

        return article;
    }

    initEventListeners () {
        document.getElementById('category-add-button').addEventListener('click',
            () => this.openNewRoute(`/categories/${this.type}/create`));

        this.categories.addEventListener("click", (e) => {
            const button = e.target.closest('button');
            if ( !button || button.textContent.trim().toLowerCase() !== 'delete' ) return false;

            const card = button.closest('.category-card');
            if ( !card ) return false;

            this.modalInstance.show();
            this.confirmDeleteListener(card.id);
        });
    }

        confirmDeleteListener (categoryId) {
        document.getElementById('modal-confirm').addEventListener("click", async () => {
            const result = await CategoriesService.deleteCategory(this.type, categoryId);
            if ( result ) {
                document.getElementById(categoryId).remove();
                this.modalInstance.hide();
            }
        }, { once: true });
    };
}
