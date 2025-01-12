import sqlite3

DB_FILE = "paytrack.db"

def get_db_connection():
    """Устанавливает подключение к базе данных."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  
    return conn

def initialize_database():
    """Инициализирует базу данных, создавая таблицу для услуг."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        cost REAL NOT NULL,
        deadline TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()