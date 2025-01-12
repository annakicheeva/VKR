# payment_manager.py


import requests
from app.payment_database import get_db_connection
from app.models.payment import PaymentCreate, PaymentUpdate


SERVICES_API_URL = "http://127.0.0.1:8000/api/services"  

def fetch_service_names():
    """Получает список названий услуг из микросервиса услуг."""
    response = requests.get(f"{SERVICES_API_URL}/names")
    if response.status_code == 200:
        return response.json()
    raise Exception("Failed to fetch service names")


def add_payment(payment_data: PaymentCreate):
    """Добавляет новый платеж в базу данных."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO payments (client_name, status, service_name, amount, date)
        VALUES (?, ?, ?, ?, ?)
    """, (payment_data.client_name, payment_data.status, payment_data.service_name, 
          payment_data.amount, payment_data.date))
    conn.commit()
    conn.close()

def get_all_payments():
    """Возвращает список всех платежей."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM payments")
    payments = cursor.fetchall()
    conn.close()
    return payments

def get_payment_by_id(payment_id: int):
    """Возвращает платеж по ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM payments WHERE id = ?", (payment_id,))
    payment = cursor.fetchone()
    conn.close()
    return payment


def get_payments_by_client_name(client_name: str):
    """Возвращает все платежи клиента по имени."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM payments 
        WHERE client_name = ?
    """, (client_name,))
    payments = cursor.fetchall()
    conn.close()
    return payments

def update_payment(payment_id: int, payment_data: PaymentUpdate):
    """Обновляет платеж по его ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE payments
        SET client_name = ?, status = ?, service_name = ?, amount = ?, date = ?
        WHERE id = ?
    """, (payment_data.client_name, payment_data.status, payment_data.service_name,
          payment_data.amount, payment_data.date, payment_id))
    conn.commit()
    conn.close()

def delete_payment(payment_id: int):
    """Удаляет платеж по его ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM payments WHERE id = ?", (payment_id,))
    conn.commit()
    conn.close()
