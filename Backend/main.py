from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime, date
import bcrypt
from pymongo import MongoClient
import os

mongo_url = os.environ.get("MONGO_URL", "mongodb://admin:admin123@localhost:27017")
app = FastAPI()
client = MongoClient(mongo_url)
db = client["lightweight_app"]
users = db["users"]

class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class WeightEntry(BaseModel):
    date: datetime
    value: float

@app.post("/login")
def login(username: str = Body(...), password: str = Body(...)):
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if not bcrypt.checkpw(password.encode(), user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    return {"message": "Login correcto"}

@app.post("/register")
def register_user(user: RegisterUser):
    if users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    
    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    user_dict = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_pw,
        "weights": []
    }
    users.insert_one(user_dict)
    return {"message": "Usuario registrado"}

@app.post("/add_weight/{username}")
def add_weight(username: str, entry: WeightEntry):
    result = users.update_one(
        {"username": username},
        {"$push": {"weights": {"date": entry.date.isoformat(), "value": entry.value}}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Peso añadido"}

@app.get("/weights/{username}", response_model=List[WeightEntry])
def get_weights(username: str):
    user = users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user["weights"]
