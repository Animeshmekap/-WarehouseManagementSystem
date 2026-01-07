
from pydantic import BaseModel, EmailStr
from typing import Optional


class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    quantity: int


# New product schemas matching frontend
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int
    company: Optional[str] = None
    delivery_partner: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductOut(ProductBase):
    id: int
    # Pydantic v2: use `model_config` with `from_attributes` to allow ORM objects
    model_config = {"from_attributes": True}


class AdminBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class AdminCreate(AdminBase):
    password: str

class AdminUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    password: Optional[str] = None

class AdminOut(AdminBase):
    id: int
    # Pydantic v2: use `model_config` with `from_attributes` to allow ORM objects
    model_config = {"from_attributes": True}

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

   