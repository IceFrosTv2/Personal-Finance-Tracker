export class ExpenseCategories {
    constructor (openNewRoute) {
        this.openNewRoute = openNewRoute;

        // Находим карточки товаров, чтобы повесить ОДНУ прослушку на всё
        this.categories = document.getElementById("categories");
        this.confirmDeleteElement = document.getElementById("confirm-delete-category");
        this.resultTextElement = document.getElementById("result-text");
        this.resultButtonElement = document.getElementById("result-button");
        this.categoryId = null

        this.init();
    }

    init () {
        this.categories.addEventListener("click", (e) => {
            // После клика находим ближайшую кнопку с атрибутом "data-action", иначе, выходим из функции
            const button = e.target.closest("[data-action]");
            if ( !button ) return false;
            // Если клик был по кнопке, то берём значение её атрибута
            const action = button.dataset.action;

            // ННаходим карточку товара, к которой была произведена операция
            const card = button.closest('.category-card');
            if ( !card ) return false;

            // Если действие - редактирование, то передаём в роутер id категории
            // и переадресовываем на страницу редактирования
            this.categoryId = card.dataset.categoryId;
            if ( action === 'edit' ) {
                // this.openNewRoute(`/category/${this.categoryId}/edit`);
                this.openNewRoute(`/category/expense/edit`);
            } else if ( action === 'delete' ) {
                this.confirmDeleteListener();
            }
        });

    }

    confirmDeleteListener () {
        this.confirmDeleteElement.addEventListener("click", async () => {
            try {
                await this.deleteCategory(this.categoryId);

                this.resultTextElement.textContent = "Category was successfully deleted";
                this.resultButtonElement.classList.remove('btn-danger');
                this.resultButtonElement.classList.add('btn-success');
            } catch (e) {
                this.resultTextElement.textContent = "Error deleting category";
                console.error(e)
                this.resultButtonElement.classList.remove('btn-success');
                this.resultButtonElement.classList.add('btn-danger');
            }
        })
    };

    async deleteCategory (categoryId) {
        const response = await fetch('api/categories/expense/' + categoryId, {
            method: 'DELETE',
        });

        if ( response.ok ) {
            throw new Error(response.statusText);
        }
        return response.json();
    }
}
