"""service_routes"""
from fastapi import APIRouter, HTTPException
from app.services.service_manager import (
    get_all_services,
    add_service,
    delete_service,
    update_service,
    find_service_by_name,
)
from app.models.service import Service, ServiceCreate
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Service])
def read_services():
    """Возвращает все услуги."""
    return get_all_services()

@router.get("/names", response_model=List[str])
def get_service_names():
    """Возвращает список названий всех услуг."""
    services = get_all_services()
    return [service.name for service in services]


@router.post("/")
def create_service(service: ServiceCreate):  
    """Добавляет новую услугу."""
    add_service(service)  
    return {"message": "Услуга добавлена"}

@router.delete("/{service_id}")
def remove_service(service_id: int):
    """Удаляет услугу по ID."""
    delete_service(service_id)
    return {"message": "Услуга удалена"}

@router.put("/{service_id}")
def modify_service(service_id: int, service: ServiceCreate):
    """Обновляет услугу."""
    update_service(service_id, service.name, service.cost, service.deadline)
    return {"message": "Услуга обновлена"}


@router.get("/search")
def search_service(name: str):
    """Ищет услугу по названию."""
    service = find_service_by_name(name)
    if service:
        return service
    raise HTTPException(status_code=404, detail="Услуга не найдена")
