import { Chart } from "chart.js/auto";
import { TempusDominus } from '@eonasdan/tempus-dominus';
import { biOneIcons } from '@eonasdan/tempus-dominus/dist/plugins/bi-one'
import { DatePicker } from "../../utils/date-picker";
import { SelectPeriod } from "../../utils/select-period";

export class Dashboard {
    constructor (openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.chartRender();

        DatePicker.getDate('fromDate');
        DatePicker.getDate('toDate');
        new SelectPeriod();
    }

    chartRender () {
        const data = {
            labels: [
                'Red',
                'Orange',
                'Yellow',
                'Green',
                'Blue',
            ],
            datasets: [{
                label: 'My First Dataset',
                data: [200, 50, 100, 100, 145],
                hoverOffset: 4
            }]
        };
        const incomesChart = document.getElementById('chart__incomes');
        const expensesChart = document.getElementById('chart__expenses');

        const chartConfig = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Roboto',
                                weight: 'bold',
                            }
                        }
                    },
                }
            },
        }
        new Chart(incomesChart, chartConfig);
        new Chart(expensesChart, chartConfig);
    };

}
