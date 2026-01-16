from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    google_id: str
    name: str
    picture: Optional[str] = None

class UserInDB(UserCreate):
    id: str
    access_token: str
    refresh_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
