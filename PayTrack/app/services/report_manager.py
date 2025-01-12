# report_manager.py

from fastapi import HTTPException
import requests
from app.models.report import ReportServiceData, ClientReportData

SERVICES_API_URL = "http://127.0.0.1:8000/api/services"  
PAYMENTS_API_URL = "http://127.0.0.1:8000/api/payments"  

def fetch_services():
    """Получает список всех услуг."""
    response = requests.get(SERVICES_API_URL)
    if response.status_code == 200:
        try:
            return response.json()  # Преобразуем ответ в JSON
        except ValueError:
            raise Exception("Invalid JSON response from services API")
    raise Exception(f"Failed to fetch services, status code: {response.status_code}")

def fetch_payments():
    """Получает список всех платежей."""
    response = requests.get(PAYMENTS_API_URL)
    if response.status_code == 200:
        try:
            data = response.json()
             #print("Payments data:", data)  
            return data
        except ValueError:
            raise Exception("Invalid JSON response from payments API")
    raise Exception(f"Failed to fetch payments, status code: {response.status_code}")



def generate_report_data():
    """Генерирует данные для отчета."""
    try:
        services = fetch_services()
        payments = fetch_payments()
        payments = payments.get('payments', [])  
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
    
    report_data = []
    for service in services:
        service_name = service.get('name')
        service_cost = service.get('cost')

        if not service_name or service_cost is None:
            continue  # Пропустить услуги с неполными данными

        
        service_payments = [p for p in payments if p.get('service_name') == service_name]
        total_income = sum(p['amount'] for p in service_payments if p['status'] in ['Оплачено', 'Оплачено частично'])
        total_payments = len(service_payments)

        # Расчет общей суммы, которую должно быть оплачено (стоимость услуги * количество платежей)
        total_expected_income = service_cost * total_payments

        # Расчет процента оплаченной суммы (включая "Оплачено" и "Оплачено частично")
        completed_percentage = (total_income / total_expected_income * 100) if total_expected_income > 0 else 0

        # Добавление данных в отчет
        report_data.append(ReportServiceData(
            name=service_name,
            cost=service_cost,
            payments_count=total_payments,
            total_income=total_income,
            completed_percentage=completed_percentage
        ).dict())

    return report_data


# Функция для генерации данных отчета по клиентам
def generate_client_report_data():
    """Генерирует данные для отчета по клиентам."""
    try:
        services = fetch_services()
        payments = fetch_payments()
        payments = payments.get('payments', [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")
    
    client_data = {}
    
    for service in services:
        service_name = service.get('name')
        service_cost = service.get('cost')

        if not service_name or service_cost is None:
            continue  

        service_payments = [p for p in payments if p.get('service_name') == service_name]

        # Обрабатываем каждого клиента
        for payment in service_payments:
            client_name = payment.get('client_name')
            paid_amount = payment.get('amount', 0)

            if client_name not in client_data:
                client_data[client_name] = {
                    "full_name": client_name,
                    "payments_count": 0,
                    "total_paid": 0,
                    "total_due": 0
                }
            
            # Увеличиваем счетчик платежей и общую сумму оплаченных средств
            client_data[client_name]["payments_count"] += 1
            client_data[client_name]["total_paid"] += paid_amount

            # Считаем задолженность (разница между стоимостью услуги и оплаченной суммой)
            expected_payment = service_cost
            client_data[client_name]["total_due"] += max(0, expected_payment - paid_amount)

    # Преобразуем данные в список для удобного использования
    client_report_data = [ClientReportData(**data) for data in client_data.values()]
    
    return client_report_data


def generate_status_report_data():
    """Генерирует данные для отчета по статусам и срокам оплаты."""
    services = fetch_services()
    payments = fetch_payments()
    payments = payments.get('payments', [])

    overdue_count = 0
    total_count = 0
    status_summary = {"Оплачено": 0, "Не оплачено": 0, "Оплачено частично": 0}
    report_rows = []

    for payment in payments:
        total_count += 1
        status_summary[payment["status"]] += 1

        service = next(
            (s for s in services if s["name"] == payment["service_name"]), None
        )
        is_overdue = False
        if service and payment["status"] != "Оплачено" and payment["date"] > service["deadline"]:
            overdue_count += 1
            is_overdue = True

        report_rows.append({
            "service_name": payment["service_name"],
            "client_name": payment["client_name"],
            "deadline": service["deadline"] if service else "Не указано",
            "status": payment["status"],
            "date": payment["date"],
            "is_overdue": is_overdue
        })
        #print("Отладка report_rows:", report_rows)  
    return {
        "total_count": total_count,
        "overdue_count": overdue_count,
        "status_summary": status_summary,
        "report_rows": report_rows
    }

    
