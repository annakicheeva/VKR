# payment_routes.py

from fastapi import APIRouter, HTTPException
from app.services.payment_manager import (
    add_payment,
    get_all_payments,
    get_payment_by_id,
    get_payments_by_client_name,
    delete_payment,
    update_payment,
    fetch_service_names,
)
from app.models.payment import PaymentCreate, PaymentUpdate
 

router = APIRouter()


@router.post("/")
def create_payment(payment_data: PaymentCreate):
    """Добавление нового платежа."""
    service_names = fetch_service_names() 
    if payment_data.service_name not in service_names:
        raise HTTPException(status_code=400, detail="Указанная услуга не найдена")
    
    add_payment(payment_data)
    return {"message": "Payment added successfully"}


@router.get("/")
def read_all_payments():
    """Получение всех платежей."""
    payments = get_all_payments()
    return {"payments": [dict(payment) for payment in payments]}


@router.get("/client")
def read_payments_by_client(client_name: str):
    """Получение платежей конкретного клиента по имени."""
    if not client_name:
        raise HTTPException(status_code=400, detail="Client name must be provided")

    payments = get_payments_by_client_name(client_name)
    if not payments:
        return {"payments": []}
    return {"payments": [dict(payment) for payment in payments]}


@router.get("/{id}")
def read_payment(id: int):
    """Получение информации о платеже по ID."""
    payment = get_payment_by_id(id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"payment": dict(payment)}



@router.put("/{id}")
def edit_payment(id: int, payment_data: PaymentUpdate):
    """Редактирование платежа."""
    try:
        update_payment(id, payment_data)
        return {"message": "Payment updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating payment: {e}")

@router.delete("/{id}")
def remove_payment(id: int):
    """Удаление платежа по ID."""
    try:
        delete_payment(id)
        return {"message": "Payment deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting payment: {e}")
