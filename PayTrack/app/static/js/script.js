// script.js

const API_URL = '/api/services/';

function navigateTo(page) {
    document.getElementById('services-page').style.display = page === 'services' ? 'block' : 'none';
    document.getElementById('payments-page').style.display = page === 'payments' ? 'block' : 'none';
}

// Установить начальную страницу
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('payments'); 
});


function displayService(service) { 
    const tableBody = document.getElementById('services-table');
    tableBody.innerHTML = ''; // Очистить текущий список
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${service.id}</td>
        <td>${service.name}</td>
        <td>${service.cost}</td>
        <td>${service.deadline}</td>
        <td>
            <button onclick="deleteService(${service.id})">Удалить</button>
            <button onclick="showUpdateForm(${service.id}, '${service.name}', ${service.cost}, '${service.deadline}')">Редактировать</button>
        </td>
    `;
    tableBody.appendChild(row);
}

async function fetchServices() {
    const response = await fetch(API_URL);
    const services = await response.json();
    const tableBody = document.getElementById('services-table');
    tableBody.innerHTML = '';
    services.forEach((service, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${service.name}</td>
            <td>${service.cost}</td>
            <td>${service.deadline}</td>
            <td>
                <button onclick="deleteService(${service.id})">Удалить</button>
                <button onclick="showUpdateForm(${service.id}, '${service.name}', ${service.cost}, '${service.deadline}')">Редактировать</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
}

async function addService(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const cost = document.getElementById('cost').value;
    const deadline = document.getElementById('deadline').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cost, deadline })
    });

    document.getElementById('add-service-form').reset();
    fetchServices();
}

async function updateService(serviceId, name, cost, deadline) {
    await fetch(`${API_URL}${serviceId}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cost, deadline })
    });
    fetchServices();
}

function showUpdateForm(id, name, cost, deadline) {
    document.getElementById('update-id').value = id;
    document.getElementById('update-name').value = name;
    document.getElementById('update-cost').value = cost;
    document.getElementById('update-deadline').value = deadline;
    document.getElementById('update-service-form').style.display = 'block';
}

async function deleteService(serviceId) {
    await fetch(`${API_URL}${serviceId}`, { method: 'DELETE' });
    fetchServices();
}

// Функция для поиска услуги по имени
async function searchService(name) {
    const response = await fetch(`${API_URL}search?name=${encodeURIComponent(name)}`);
    if (response.ok) {
        const service = await response.json();
        displayService(service); // Отобразим найденную услугу
    } else {
        alert('Услуга не найдена');
    }
}

document.getElementById('search-service-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('search-name').value;
    await searchService(name);
});


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-service-form').addEventListener('submit', addService);
    document.getElementById('update-service-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const serviceId = document.getElementById('update-id').value;
        const name = document.getElementById('update-name').value;
        const cost = document.getElementById('update-cost').value;
        const deadline = document.getElementById('update-deadline').value;

        await updateService(serviceId, name, cost, deadline);

        document.getElementById('update-service-form').style.display = 'none';
    });
    fetchServices();
});
