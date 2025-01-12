import pytest
from unittest.mock import MagicMock
from app.services.payment_manager import (
    fetch_service_names,
    add_payment,
    get_all_payments,
    update_payment,
    delete_payment,
)
from app.models.payment import PaymentCreate, PaymentUpdate


# Мокируем внешний API для fetch_service_names
def test_fetch_service_names(mocker):
    # Мокаем requests.get
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = ["Service1", "Service2"]
    mocker.patch("app.services.payment_manager.requests.get", return_value=mock_response)

    service_names = fetch_service_names()
    assert service_names == ["Service1", "Service2"]


# Тест получения всех платежей
def test_get_all_payments(mocker):
    # Мокаем подключение к базе данных
    mock_db_conn = mocker.patch("app.services.payment_manager.get_db_connection")
    mock_cursor = mock_db_conn.return_value.cursor.return_value

    mock_cursor.fetchall.return_value = [
        {"id": 1, "client_name": "Anna", "service_name": "Service1", "amount": 100.5}
    ]

    payments = get_all_payments()
    assert len(payments) == 1
    assert payments[0]["client_name"] == "Anna"


