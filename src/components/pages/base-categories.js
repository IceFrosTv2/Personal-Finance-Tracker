import * as bootstrap from 'bootstrap';

export class BaseCategories {
    constructor (openNewRoute, type) {
        this.openNewRoute = openNewRoute;
        this.type = type;
        // Находим карточки товаров, чтобы повесить ОДНУ прослушку на всё
        this.categories = document.getElementById("categories");
        this.modalInstance = new bootstrap.Modal(document.getElementById("category-modal")) ;
        this.modalText = document.getElementById("modal-text");
        this.modalConfirm = document.getElementById("modal-confirm");
        this.modalCancel = document.getElementById("modal-cancel");
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

            // Находим карточку товара, к которой была произведена операция
            const card = button.closest('.category-card');
            if ( !card ) return false;

            // Если действие - редактирование, то передаём в роутер id категории
            // и переадресовываем на страницу редактирования
            this.categoryId = card.dataset.categoryId;
            if ( action === 'edit' ) {
                this.openNewRoute(`/categories/${this.type}/edit?id=${this.categoryId}`);
            } else if ( action === 'delete' ) {
                this.modalText.textContent = 'Are you sure you want to delete this category? Related income will remain uncategorized.';
                this.modalConfirm.textContent = 'Delete';
                this.modalConfirm.className = 'btn btn-danger';
                this.modalCancel.style.display = 'block';

                this.modalInstance.show();
                this.confirmDeleteListener();
            }
        });

    }

    confirmDeleteListener () {
        this.modalConfirm.addEventListener("click", async () => {
                try {
                    await this.deleteCategory(this.categoryId);
                    this.modalText.textContent = "Category was successfully deleted";
                    this.modalConfirm.className = 'btn btn-success';
                } catch (e) {
                    this.modalText.textContent = "Error deleting category";
                    // console.error(e)
                }
                this.modalCancel.style.display = 'none';
                this.modalConfirm.textContent = 'Ok';
                this.modalConfirm.addEventListener('click', () => {
                    this.modalInstance.hide();
                }, {once: true});
            },
            { once: true });
    };

    async deleteCategory (categoryId) {
        const response = await fetch(`/api/categories/${this.type}/` + categoryId, {
            method: 'DELETE',
        });

        if ( !response.ok ) {
            throw new Error(response.statusText);
        }
        return response.json();
    }
}
