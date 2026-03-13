from app.database import engine
from sqlalchemy import text

with engine.begin() as conn:
    conn.execute(text("ALTER TABLE employees ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;"))
    print("Column added")
