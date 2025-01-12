"""service_manager"""
from app.database import get_db_connection
from typing import List, Optional
from app.models.service import Service, ServiceCreate

def get_all_services() -> List[Service]:
    """Возвращает список всех услуг из базы данных."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services")
    services = cursor.fetchall()
    conn.close()
    return [Service(id=row["id"], name=row["name"], cost=row["cost"], deadline=row["deadline"]) for row in services]

def add_service(service: ServiceCreate):
    """Добавляет новую услугу в базу данных."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO services (name, cost, deadline)
    VALUES (?, ?, ?)
    """, (service.name, service.cost, service.deadline))
    conn.commit()
    conn.close()


def delete_service(service_id: int):
    """Удаляет услугу по ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM services WHERE id = ?", (service_id,))
    conn.commit()
    conn.close()

def update_service(service_id: int, name: str, cost: float, deadline: str):
    """Обновляет информацию об услуге."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE services
    SET name = ?, cost = ?, deadline = ?
    WHERE id = ?
    """, (name, cost, deadline, service_id))
    conn.commit()
    conn.close()

def find_service_by_name(name: str) -> Optional[Service]:
    """Ищет услугу по названию."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM services WHERE name = ?", (name,))
    service = cursor.fetchone()
    conn.close()
    if service:
        return Service(id=service["id"], name=service["name"], cost=service["cost"], deadline=service["deadline"])
    return None
