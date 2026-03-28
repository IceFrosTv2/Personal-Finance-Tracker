import {CategoriesService} from "../../../services/categories-service";
import {ModalUtils} from "../../../utils/modal-utils";
import type {OpenNewRouteType} from "../../../types/open-new-route.type";
import type {CategoryType} from "../../../types/category.type";

export class BaseCategories {
    categories!: HTMLElement;

    constructor(private openNewRoute: OpenNewRouteType, private type: string) {
        this.init().then();
    }

    private async init(): Promise<void> {
        this.renderLayout();

        // Находим карточки товаров, чтобы повесить ОДНУ прослушку на всё
        this.categories = document.getElementById("categories") as HTMLElement;
        if (!this.categories) return;

        const result = await CategoriesService.getCategories(this.type);
        if (result) this.renderCategories(result);

        this.initEventListeners();
    }

    private renderLayout(): void {
        const contentMain = document.getElementById('content__main')
        if (!contentMain) return;
        contentMain.innerHTML = `
        <section class="container">
            <header class="page-title">${this.type.toUpperCase()}</header>
            <div id="categories" class="categories"></div>
        </section>`;
    }

    private renderCategories(categories: CategoryType[]): void {
        for (const category of categories) {
            this.categories.appendChild(this.createCategoryCard(category));
        }
        this.categories.insertAdjacentHTML('beforeend', '<button id="category-add-button" class="category-card" type="button">+</button>');
    }

    private createCategoryCard(category: CategoryType): HTMLElement {
        const article = document.createElement("article");
        article.id = category.id.toString();
        article.className = "category-card";

        const h3 = document.createElement("h3");
        h3.className = "category-card__title";
        h3.textContent = category.title;
        article.appendChild(h3);

        article.insertAdjacentHTML('beforeend', `
            <div class="category-card__actions">
                <a href="/categories/${this.type}/edit?id=${category.id}" class="btn btn-primary">Edit</a>
                <button class="btn btn-danger" type="button" data-action="delete">Delete</button>
            </div>
        `);

        return article;
    }

    private initEventListeners(): void {
        document.getElementById('category-add-button')?.addEventListener('click',
            () => this.openNewRoute(`/categories/${this.type}/create`));

        this.categories.addEventListener("click", (e) => {
            if (!e.target || !(e.target instanceof Element)) return;
            const button = e.target.closest('button');
            if (!button || button.dataset.action !== 'delete') return;

            const card = button.closest('.category-card');
            if (!card) return;

            ModalUtils.confirm('category', async () => {
                const result = await CategoriesService.deleteCategory(this.type, card.id);
                if (result) {
                    card.remove();
                }
            })
        });
    }
}
