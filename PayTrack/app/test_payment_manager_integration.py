import pytest
import requests
from unittest.mock import patch
from app.services.payment_manager import fetch_service_names


# Тест для успешного получения списка услуг
def test_fetch_service_names_success():
    """Интеграционное тестирование: успешное получение списка услуг из микросервиса."""
    
    # Мокаем реальный запрос к API
    with patch('requests.get') as mock_get:
        # Настроим мок, чтобы возвращался успешный ответ с нужными данными
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = ['Service1', 'Service2', 'Service3']
        
        # Выполняем вызов функции
        result = fetch_service_names()
        
        # Проверяем, что результат является списком
        assert isinstance(result, list), "Ожидался список, получено что-то другое"
        
        # Проверяем, что список не пустой
        assert len(result) > 0, "Список услуг пуст"


# Тест для неудачного получения списка услуг
def test_fetch_service_names_failure():
    """Интеграционное тестирование: ошибка при получении данных из микросервиса."""
    
    # Мокаем реальный запрос к API, чтобы он вернул ошибку
    with patch('requests.get') as mock_get:
        # Настроим мок, чтобы возвращалась ошибка соединения
        mock_get.side_effect = requests.exceptions.ConnectionError("Failed to connect to the service")
        
        # Проверяем, что выбрасывается исключение при ошибке
        with pytest.raises(requests.exceptions.ConnectionError):
            fetch_service_names()
