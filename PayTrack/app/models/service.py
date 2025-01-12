"""service"""
from pydantic import BaseModel

class Service(BaseModel):
    id: int # Номер услуги
    name: str # Название услуги
    cost: float # Стоимость 
    deadline: str # Срок оплаты

class ServiceCreate(BaseModel):
    name: str
    cost: float
    deadline: str