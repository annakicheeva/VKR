# uvicorn app.main:app --reload
# uvicorn app.main:app --reload --ssl-keyfile key.pem --ssl-certfile cert.pem
# main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.routes.service_routes import router as service_router
from app.routes.payment_routes import router as payment_router
from app.routes.report_routes import router as report_router

# Создаем приложение
app = FastAPI(title="PayTrack")

# Подключение маршрутов микросервисов
app.include_router(service_router, prefix="/api/services", tags=["Services"])
app.include_router(payment_router, prefix="/api/payments", tags=["Payments"])
app.include_router(report_router, prefix="/api/reports", tags=["Reports"])

# Подключение статических файлов и шаблонов
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

# Главная страница
@app.get("/", response_class=HTMLResponse)
def read_root():
    return templates.TemplateResponse("index.html", {"request": {}})

# Страница отчета
@app.get("/report", response_class=HTMLResponse)
def read_report():
    return templates.TemplateResponse("report.html", {"request": {}})

