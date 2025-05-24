from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime, date
import bcrypt
from pymongo import MongoClient

app = FastAPI()
client = MongoClient("mongodb://admin:admin123@192.168.0.16:27017")
db = client["lightweight_app"]
users = db["users"]

# ---- Modelos ----
class RegisterUser(BaseModel):
    username: str
    email: EmailStr
    password: str

class WeightEntry(BaseModel):
    date: datetime
    value: float

# ---- Endpoints ----
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
