# report_routes.py

from fastapi import APIRouter
from app.services.report_manager import generate_report_data, generate_client_report_data, generate_status_report_data

router = APIRouter()

@router.get("/", summary="Получить данные для отчета")
def get_report():
    return generate_report_data()


@router.get("/clients", summary="Получить отчет по клиентам")
def get_client_report():
    return generate_client_report_data()


@router.get("/status", summary="Получить отчет по статусам и срокам оплаты")
def get_status_report():
    return generate_status_report_data()