#payment.py

from pydantic import BaseModel
from enum import Enum


class Payment(BaseModel):
    client_name: str  # Имя клиента
    status: str  # Статус
    service_name: str  # Название услуги
    amount: float  # Сумма платежа
    date: str  # Дата платежа 
    

class PaymentCreate(BaseModel):
    client_name: str
    status: str
    service_name: str
    amount: float
    date: str  
    
class PaymentUpdate(BaseModel):
    client_name: str
    status: str
    service_name: str
    amount: float
    date: str