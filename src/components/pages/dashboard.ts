import { Chart } from "chart.js/auto";
import { BaseFiltersPage } from "./base-filters-page";
import { CategoriesService } from "../../services/categories-service";
import { OperationsService } from "../../services/operations-service";
import {OperationTypeEnum} from "../../types/operation-type.enum";
import type {OperationsType} from "../../types/operations.type";

export class Dashboard extends BaseFiltersPage {
    private incomeChart: Chart | null = null;
    private expenseChart: Chart | null = null;

    constructor () {
        super();

        this.initPeriodFilter(() => this.renderCharts());
        this.renderCharts().then();
    }

    private async renderCharts (): Promise<void> {
        await Promise.all([
            this.chartRender(OperationTypeEnum.INCOME,
                document.getElementById('chart__incomes') as HTMLCanvasElement),
            this.chartRender(OperationTypeEnum.EXPENSE,
                document.getElementById('chart__expenses') as HTMLCanvasElement),
        ]);
    }

   private async chartRender (type: string, chartElement: HTMLCanvasElement | null): Promise<void> {
        // Получаем массив объектов [{ id: 1, title: 'Зарплата' }, { id: 2, title: 'Депозиты' }, ...]
        const categories = await CategoriesService.getCategories(type);
        if (!categories || !chartElement) return;

        // Получаем все операции [{ type: 'income', category: 'Зарплата', amount: 500 }, ...]
        let operations: OperationsType[] | null;
        if ( this.dateFrom && this.dateTo ) {
            operations = await OperationsService.getOperationsWithFilter(this.dateFrom, this.dateTo)
        } else if ( this.period === 'all' ) {
            operations = await OperationsService.getAllOperations()
        } else {
            operations = await OperationsService.getTodayOperations();
        }

        // Оставляем только операции нужного типа переданной в type
        // filter создаёт новый массив, оставляя только элементы, где условие true
       if (!operations) return;
        const filteredOperations = operations.filter(operation => operation.type === type);

        // map перебирает каждую категорию и возвращает число — сумму по ней
        // для каждой категории:
        //   1. filter оставляет только операции этой категории
        //   2. reduce суммирует их amount
        //      reduce(колбэк, начальное_значение)
        //      sum — накопитель (начинается с 0)
        //      operation — текущий элемент массива
        //      sum + operation.amount — добавляем amount к накопителю
        // В итоге amounts = [1500, 300, 800, ...] — по одному числу на каждую категорию
        const data = categories.map(category => {
            return filteredOperations
                .filter(operation => operation.category === category.title)
                .reduce((sum, operation) => sum + operation.amount, 0);
        });

        // map вытаскивает только title из каждого объекта категорий
        // ['Зарплата', 'Депозиты', 'Фриланс', ...]
        const labels = categories.map(category => category.title);

        // Ищем операции у которых category пустой или null (удалённая категория)
        const uncategorizedAmount = filteredOperations
            .filter(operation => !operation.category)
            .reduce((sum, operation) => sum + operation.amount, 0);

        // Добавляем "Other" только если такие операции реально есть
        if ( uncategorizedAmount > 0 ) {
            labels.push('Other');  // добавляем строку в конец массива лейблов
            data.push(uncategorizedAmount);  // добавляем сумму в конец массива данных
        }

        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const saturation = isDark ? 40 : 70;
        const lightness = isDark ? 50 : 60;
        const colors = labels.map((_, i) =>
            `hsl(${(i * 360 / labels.length)}, ${saturation}%, ${lightness}%)`
        );

        // Проверяем тип графика
        const chartInstance = type === OperationTypeEnum.INCOME ? this.incomeChart : this.expenseChart;

        const chartConfig = {
            type: 'pie' as const,
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    hoverOffset: 8,
                    backgroundColor: colors,
                },]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top' as const,
                        labels: {
                            font: {
                                family: 'Roboto' as const,
                                weight: 'bold' as const,
                            }
                        }
                    },
                    colors: {
                        enabled: false
                    }
                }
            },
        }
        if ( chartInstance ) {
            chartInstance.data.labels = labels;
            const datasets = chartInstance.data.datasets[0];
            if (!datasets) return;
            datasets.data = data;
            datasets.backgroundColor = colors
            chartInstance.update();
        } else {
            const newChart = new Chart(chartElement, chartConfig);
            if ( type === OperationTypeEnum.INCOME ) this.incomeChart = newChart;
            else this.expenseChart = newChart;
        }
    };

}
