"""Utility script to create DB tables (reads DATABASE_URL from env)."""
from app.db import init_db

if __name__ == '__main__':
    init_db()
    print("Tables created (if missing).")
