import {CategoriesService} from "../../../services/categories-service";
import {OperationsService} from "../../../services/operations-service";
import {DatePicker} from "../../../utils/date-picker";
import {Layout} from "../../layout";
import type {OpenNewRouteType} from "../../../types/open-new-route.type";
import {OperationTypeEnum} from "../../../types/operation-type.enum";

export class OperationsForm {
    private readonly operationId!: string;
    private readonly operationType!: string;
    private typeSelect!: HTMLSelectElement;
    private categorySelect!: HTMLSelectElement;
    private amountInput!: HTMLInputElement;
    private dateInput!: HTMLInputElement;
    private commentInput!: HTMLInputElement;
    private selectedDate: Date | null = null;

    constructor(private openNewRoute: OpenNewRouteType) {
        const params = new URLSearchParams(location.search);
        this.operationId = params.get('id') as string;
        this.operationType = params.get('operation') as string;
        if (!this.operationId && !this.operationType) return;
        this.init().then();
    }

    private async init(): Promise<void> {
        const contentMain = document.getElementById('content__main');
        if (!contentMain) return;

        contentMain.innerHTML = `
        <section class="container">
            <header class="page-title">${this.operationId ? 'Edit' : 'Create'} operation</header>
            <div class="operation">
                <form class="form-group">
                    <select id="operation__type" class="form-select" aria-label="Type">
                        <option value=${OperationTypeEnum.INCOME}>Income</option>
                        <option value=${OperationTypeEnum.EXPENSE}>Expense</option>
                    </select>
                    <select id="operation__category" class="form-select" aria-label="Category">
                    </select>
                    <input id="operation__amount" type="number" class="form-control" placeholder="Amount in $..." aria-label="Amount">
                    <input id="operation__date" class="form-control" placeholder="Date..." aria-label="Date">
                    <input id="operation__comment" class="form-control" placeholder="Comment..." aria-label="Note">
                </form>
                <div class="actions-group">
                    <button id="operation__save" class="btn btn-success" type="button">
                        ${this.operationId ? 'Save' : 'Create'}
                    </button>
                    <a href="/operations" class="btn btn-danger">Cancel</a>
                </div>
            </div>
        </section>
        `;

        this.typeSelect = document.getElementById('operation__type') as HTMLSelectElement;
        this.categorySelect = document.getElementById('operation__category') as HTMLSelectElement;
        this.amountInput = document.getElementById('operation__amount') as HTMLInputElement;
        this.dateInput = document.getElementById('operation__date') as HTMLInputElement;
        this.commentInput = document.getElementById('operation__comment') as HTMLInputElement;
        if (!this.typeSelect || !this.categorySelect || !this.amountInput || !this.dateInput || !this.commentInput) return;


        if (this.operationId) {
            await this.fillEditFields();
        } else if (this.operationType) {
            this.typeSelect.value = this.operationType;
            await this.loadCategories(this.operationType);
        }

        DatePicker.getDate('operation__date', (date) => {
            this.selectedDate = date;
        });

        this.typeSelect.addEventListener('change',
            async () => await this.loadCategories(this.typeSelect.value));

        const buttonSave = document.getElementById('operation__save');
        if (!buttonSave) return;

        buttonSave.addEventListener('click', () => this.save())
    }

    private async loadCategories(operationType: string): Promise<void> {
        const categories = await CategoriesService.getCategories(operationType);
        if (categories) {
            this.categorySelect.innerHTML = categories
                .map(category => `<option value="${category.id}">${category.title}</option>`)
                .join('');
        }
    }

    private async fillEditFields(): Promise<void> {
        const operation = await OperationsService.getOperationById(this.operationId);
        if (!operation) return;

        this.typeSelect.value = operation.type;
        await this.loadCategories(operation.type);

        const match = Array.from(this.categorySelect.options)
            .find(option => option.text === operation.category);
        if (match) this.categorySelect.value = match.value;

        this.amountInput.value = operation.amount.toString();
        this.dateInput.value = operation.date;
        this.commentInput.value = operation.comment;
    }

    private async save(): Promise<void> {
        const data = {
            type: this.typeSelect.value as OperationTypeEnum,
            category_id: Number(this.categorySelect.value),
            amount: Number(this.amountInput.value),
            date: this.selectedDate
                ? this.selectedDate.toISOString().split('T')[0] ?? ''
                : this.dateInput.value,
            comment: this.commentInput.value,
        };
        const result = this.operationId
            ? await OperationsService.updateOperation(this.operationId, data)
            : await OperationsService.createOperation(data);
        if (result) {
            await Layout.getBalance();
            await this.openNewRoute('/operations');
        }
    }
}
