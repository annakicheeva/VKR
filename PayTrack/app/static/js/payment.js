// payments.js

const PAYMENTS_API_URL = '/api/payments/';

const SERVICES_API_URL = '/api/services/names'; 

// Функция для получения списка услуг
async function fetchServiceNames() {
    try {
        const response = await fetch(SERVICES_API_URL);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке списка услуг');
        }
        const serviceNames = await response.json();
        const serviceDropdown = document.getElementById('service-name');
        serviceDropdown.innerHTML = ''; // Очистка старых данных
        serviceNames.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceDropdown.appendChild(option);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Вызов функции для загрузки списка услуг при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchServiceNames(); // Загружаем список услуг
    document.getElementById('add-payment-form').addEventListener('submit', addPayment);
    document.getElementById('update-payment-form').addEventListener('submit', updatePayment);
    document.getElementById('search-payment-form').addEventListener('submit', searchPayments);
    fetchPayments();
});

// Функция для получения всех платежей
async function fetchPayments() {
    try {
        const response = await fetch(PAYMENTS_API_URL);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке платежей');
        }
        const data = await response.json();
        const payments = data.payments;
        const tableBody = document.getElementById('payments-table');
        tableBody.innerHTML = ''; // Очищаем таблицу

        payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${payment.client_name}</td>
                <td>${payment.service_name}</td>
                <td>${payment.amount}</td>
                <td>${payment.date}</td>
                <td>${payment.status}</td>
                <td>
                <button onclick="deletePayment(${payment.id})">Удалить</button>
                <button onclick="editPayment(${payment.id})">Редактировать</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}

// Функция для добавления нового платежа
async function addPayment(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы
    const clientName = document.getElementById('client-name').value;
    const clientStatus = document.getElementById('status').value;
    const serviceName = document.getElementById('service-name').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    

    const paymentData = { client_name: clientName, status: clientStatus, service_name: serviceName, amount, date };

    try {
        const response = await fetch(PAYMENTS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            throw new Error('Ошибка при добавлении платежа');
        }

        document.getElementById('add-payment-form').reset(); // Очистить форму
        fetchPayments(); // Обновить список платежей
    } catch (error) {
        alert(error.message);
    }
}



// Функция для удаления платежа
async function deletePayment(paymentId) {
    try {
        const response = await fetch(`${PAYMENTS_API_URL}${paymentId}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Ошибка при удалении платежа');
        }
        fetchPayments(); // Обновить список платежей после удаления
    } catch (error) {
        alert(error.message);
    }
}

// Функция для отображения формы редактирования платежа с заполнением данных
function showUpdatePaymentForm(payment) {
    document.getElementById('update-payment-id').value = payment.id; // ID передается корректно
    document.getElementById('update-client-name').value = payment.client_name;
    document.getElementById('update-status').value = payment.status;
    document.getElementById('update-service-name').value = payment.service_name;
    document.getElementById('update-amount').value = payment.amount;
    document.getElementById('update-date').value = payment.date;
    document.getElementById('update-payment-form').style.display = 'block'; // Показать форму
}

// Функция для загрузки данных платежа перед редактированием
async function editPayment(paymentId) {
    try {
        const response = await fetch(`${PAYMENTS_API_URL}${paymentId}`);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных платежа');
        }
        const { payment } = await response.json(); // Получить объект payment
        showUpdatePaymentForm(payment); // Передать объект в функцию отображения формы
    } catch (error) {
        alert(error.message);
    }
}

// Функция для обновления данных платежа
async function updatePayment(event) {
    event.preventDefault();
    const paymentId = document.getElementById('update-payment-id').value.trim(); // Убедиться, что ID не пустой
    if (!paymentId) {
        alert('Ошибка: ID платежа отсутствует');
        return;
    }

    const clientName = document.getElementById('update-client-name').value.trim();
    const clientStatus = document.getElementById('update-status').value.trim();
    const serviceName = document.getElementById('update-service-name').value.trim();
    const amount = parseFloat(document.getElementById('update-amount').value); // Преобразование суммы в число
    const date = document.getElementById('update-date').value.trim();

    const paymentData = { client_name: clientName, status: clientStatus, service_name: serviceName, amount, date };

    try {
        const response = await fetch(`${PAYMENTS_API_URL}${paymentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Ошибка при обновлении платежа: ${errorText}`);
        }

        document.getElementById('update-payment-form').style.display = 'none';
        fetchPayments(); // Обновить список платежей
    } catch (error) {
        alert(error.message);
    }
}


// Функция для отображения таблицы платежей
function renderPaymentsTable(payments) {
    const tableBody = document.getElementById('payments-table');
    tableBody.innerHTML = '';

    payments.forEach((payment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${payment.client_name}</td>
            <td>${payment.status}</td>
            <td>${payment.service_name}</td>
            <td>${payment.amount}</td>
            <td>${payment.date}</td>
            
            <td>
                <button onclick="deletePayment(${payment.id})">Удалить</button>
                <button onclick="editPayment(${payment.id})">Редактировать</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}



async function searchPayments(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы
    const clientName = document.getElementById('search-client-name').value.trim();

    if (!clientName) {
        alert("Введите имя клиента");
        return;
    }

    try {
        // Убедитесь, что имя клиента передается как строка
        const response = await fetch(`/api/payments/client?client_name=${encodeURIComponent(clientName)}`);
        if (!response.ok) {
            if (response.status === 404) {
                alert("Нет платежей для данного клиента");
            } else {
                throw new Error('Ошибка при поиске платежей');
            }
            return;
        }
        const data = await response.json();
        const payments = data.payments;
        const tableBody = document.getElementById('payments-table');
        tableBody.innerHTML = ''; // Очищаем таблицу

        if (payments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Нет платежей для данного клиента</td></tr>';
            return;
        }

        payments.forEach((payment, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${payment.client_name}</td>
                <td>${payment.service_name}</td>
                <td>${payment.amount}</td>
                <td>${payment.date}</td>
                <td>${payment.status}</td>
                <td>
                <button onclick="deletePayment(${payment.id})">Удалить</button>
                <button onclick="editPayment(${payment.id})">Редактировать</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        alert(error.message);
    }
}



// Инициализация событий
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-payment-form').addEventListener('submit', addPayment);
    document.getElementById('update-payment-form').addEventListener('submit', updatePayment);
    document.getElementById('search-payment-form').addEventListener('submit', searchPayments);
    fetchPayments();
});
