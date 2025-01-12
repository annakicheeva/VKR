# report.py

from pydantic import BaseModel

class ReportServiceData(BaseModel):
    name: str  # Название услуги
    cost: float  # Стоимость услуги
    payments_count: int  # Количество платежей
    total_income: float  # Общая сумма оплат
    completed_percentage: float  # Процент выполненных платежей


class ClientReportData(BaseModel):
    full_name: str  # ФИО клиента
    payments_count: int  # Количество платежей
    total_paid: float  # Общая сумма оплаченных платежей
    total_due: float  # Общая задолженность 
