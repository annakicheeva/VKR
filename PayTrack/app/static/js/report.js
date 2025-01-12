document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/reports")
        .then(response => response.json())
        .then(data => {
            // Заполнение таблицы
            populateTable(data);
            // Расчет итоговых данных
            calculateSummary(data);
            // Построение графиков
            buildCharts(data);

        });

    function populateTable(data) {
        const tableBody = document.getElementById("report-table-body");
        tableBody.innerHTML = ""; 
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.cost}</td>
                <td>${row.payments_count}</td>
                <td>${row.total_income}</td>
                <td>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${row.completed_percentage}%;"></div>
                    </div>
                    ${row.completed_percentage.toFixed(2)}%
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Функция для расчета итоговых данных
    function calculateSummary(data) {
        let totalIncome = 0;
        let totalPayments = 0;

        data.forEach(row => {
            totalIncome += row.total_income;
            totalPayments += row.payments_count;
        });

        // Отображаем итоги
        document.getElementById("total-income").textContent = totalIncome.toFixed(2) + " ₽";
        document.getElementById("total-payments").textContent = totalPayments;
    }

    function buildCharts(data) {
        const serviceNames = data.map(row => row.name);
        const paymentsCounts = data.map(row => row.payments_count);
        const incomes = data.map(row => row.total_income);

        // Круговая диаграмма популярности услуг
        new Chart(document.getElementById("popularityChart"), {
            type: "pie",
            data: {
                labels: serviceNames,
                datasets: [{
                    label: "Количество платежей",
                    data: paymentsCounts,
                    backgroundColor: [
                        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#D35400", "#7D3C98", "#16A085", "#27AE60", "#2980B9", "#F39C12", "#BDC3C7"
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            }
        });

        // Горизонтальная столбчатая диаграмма доходов
        new Chart(document.getElementById("incomeChart"), {
            type: "bar",
            data: {
                labels: serviceNames,
                datasets: [{
                    label: "Оплаты",
                    data: incomes,
                    backgroundColor: [
                        "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#1ABC9C", "#D35400", "#7D3C98", "#16A085", "#27AE60", "#2980B9", "#F39C12", "#BDC3C7"
                    ],
                }]
            },
            options: {
                indexAxis: 'y', 
                responsive: true,
                plugins: {
                    legend: {
                        position: "top", 
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `Оплачено: ${tooltipItem.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Общая сумма оплат',
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Услуги',
                        }
                    }
                }
            }
        });

    }


});


document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/reports/clients")
        .then(response => response.json())
        .then(data => {
            populateClientTable(data);
            calculateClientSummary(data);
            buildClientCharts(data);
        });

    function populateClientTable(data) {
        const tableBody = document.getElementById("client-report-table-body");
        tableBody.innerHTML = ""; 
        data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.full_name}</td>
                <td>${row.payments_count}</td>
                <td>${row.total_paid}</td>
                <td>${row.total_due}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Функция для расчета итоговых данных по клиентам
    function calculateClientSummary(data) {
        let totalIncome = 0;
        let totalPayments = 0;
        let totalDebt = 0;

        data.forEach(row => {
            totalIncome += row.total_paid;
            totalPayments += row.payments_count;
            totalDebt += row.total_due;
        });

        // Отображаем итоги
        document.getElementById("total-client-income").textContent = totalIncome.toFixed(2) + " ₽";
        document.getElementById("total-client-payments").textContent = totalPayments;
        document.getElementById("total-client-debt").textContent = totalDebt.toFixed(2) + " ₽";
    }

    function buildClientCharts(data) {
        const clientNames = data.map(row => row.full_name);
        const paymentsCounts = data.map(row => row.payments_count);
        const paidAmounts = data.map(row => row.total_paid);
        const dueAmounts = data.map(row => row.total_due);


        // Массив цветов для столбиков
        const barColors = [
             "#4BC0C0", "#9966FF", "#FF9F40", "#FF6384", "#36A2EB", "#FFCE56", "#1ABC9C", "#D35400", "#7D3C98", "#16A085", "#27AE60", "#2980B9", "#F39C12", "#BDC3C7"
        ];

        // График задолженности по клиентам
        new Chart(document.getElementById("clientDebtChart"), {
            type: "bar",
            data: {
                labels: clientNames,
                datasets: [{
                    label: "Задолженность",
                    data: dueAmounts,
                    backgroundColor: barColors, 
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Задолженность'
                        }
                    }
                }
            }
        });

    }
});


document.addEventListener("DOMContentLoaded", () => {

    fetch("/api/reports/status")
        .then((response) => response.json())
        .then((data) => {
            populateTable(data.report_rows);
            enableSorting(data.report_rows);
            buildStatusCharts(data);
        });

    function populateTable(rows) {
        const tableBody = document.getElementById("status-report-table-body");
        tableBody.innerHTML = ""; 

        rows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.service_name}</td>
                <td>${row.client_name}</td>
                <td>${row.deadline}</td>
                <td>${row.status}</td>
                <td>${row.date}</td>
                <td>${row.is_overdue ? "Да" : "Нет"}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function enableSorting(rows) {
        const headers = document.querySelectorAll("th[data-column]");
    
        headers.forEach((header) => {
            header.addEventListener("click", () => {
                const column = header.getAttribute("data-column");
                const order = header.getAttribute("data-order") === "asc" ? "desc" : "asc";
    
                // Сортировка данных
                const sortedRows = rows.sort((a, b) => {
                    if (a[column] < b[column]) return order === "asc" ? -1 : 1;
                    if (a[column] > b[column]) return order === "asc" ? 1 : -1;
                    return 0;
                });
    
                header.setAttribute("data-order", order);
                populateTable(sortedRows);
            });
        });
    }
    
    function buildStatusCharts(data) {
        // Круговая диаграмма статусов
        new Chart(document.getElementById("statusChart"), {
            type: "doughnut",
            data: {
                labels: ["Оплачено", "Не оплачено", "Частично оплачено"],
                datasets: [
                    {
                        label: "Статус платежей",
                        data: Object.values(data.status_summary),
                        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        });

        // Линейная диаграмма по датам оплат
        const paymentDates = data.report_rows.map(row => row.date);
        const overdueStatuses = data.report_rows.map(row => (row.is_overdue ? 1 : 0));

        new Chart(document.getElementById("paymentDatesChart"), {
            type: "line",
            data: {
                labels: paymentDates,
                datasets: [
                    {
                        label: "Просрочено",
                        data: overdueStatuses,
                        borderColor: "#FF6384",
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Дата оплаты",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Просрочки (1 = Да, 0 = Нет)",
                        },
                    },
                },
            },
        });
    }
    
});
