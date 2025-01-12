#payment_database.py
import sqlite3

DB_FILE = "payment.db"  

def get_db_connection():
    """Устанавливает подключение к базе данных."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  
    return conn

def initialize_payment_database():
    """Инициализирует базу данных для платежей."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        status TEXT NOT NULL,
        service_name TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

