from fastapi import FastAPI
from .routers import message
from .db import init_db

app = FastAPI(title="ServicePilot Backend — Block 1")
app.include_router(message.router, prefix="/api")

@app.on_event("startup")
def on_startup():
    # Initialize DB tables
    init_db()

@app.get("/")
def root():
    return {"status": "servicepilot backend (block 1) running"}
