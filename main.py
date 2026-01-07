from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from sqlalchemy.exc import SQLAlchemyError

import database_models
from database import SessionLocal, engine
from models import (
    ProductCreate,
    ProductOut,
    AdminCreate,
    AdminLogin,
    AdminUpdate,
    AdminOut
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

database_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Warehouse Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Welcome to Warehouse Management"}

@app.get("/health")
def health():
    return {"status": "ok"}



#  PRODUCTS 


@app.get("/Products", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    try:
        return db.query(database_models.Product).all()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail="Failed to fetch products")


@app.post("/Products", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        db_product = database_models.Product(**product.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Product creation failed")


@app.put("/Products", response_model=ProductOut)
def update_product(id: int, product: ProductCreate, db: Session = Depends(get_db)):
    try:
        db_product = db.query(database_models.Product).filter(
            database_models.Product.id == id
        ).first()

        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")

        for key, value in product.model_dump().items():
            setattr(db_product, key, value)

        db.commit()
        db.refresh(db_product)
        return db_product

    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Product update failed")


@app.delete("/Products")
def delete_product(id: int, db: Session = Depends(get_db)):
    try:
        db_product = db.query(database_models.Product).filter(
            database_models.Product.id == id
        ).first()

        if not db_product:
            raise HTTPException(status_code=404, detail="Product not found")

        db.delete(db_product)
        db.commit()
        return {"message": "Product deleted successfully"}

    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Product deletion failed")


#  ADMINS 


@app.post("/admins/register")
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(database_models.Admin).filter(
            database_models.Admin.email == admin.email
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed = pwd_context.hash(admin.password)
        db_admin = database_models.Admin(
            email=admin.email,
            name=admin.name,
            hashed_password=hashed
        )

        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        return {"message": "Admin registered successfully", "admin": AdminOut.from_orm(db_admin)}

    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Admin registration failed")


@app.post("/admins/login")
def login_admin(credentials: AdminLogin, db: Session = Depends(get_db)):
    try:
        admin = db.query(database_models.Admin).filter(
            database_models.Admin.email == credentials.email
        ).first()

        if not admin or not pwd_context.verify(credentials.password, admin.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"message": "Login successful", "admin": AdminOut.from_orm(admin)}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Login failed")


@app.get("/admins", response_model=list[AdminOut])
def list_admins(db: Session = Depends(get_db)):
    try:
        return db.query(database_models.Admin).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch admins")


@app.get("/admins/{admin_id}", response_model=AdminOut)
def get_admin(admin_id: int, db: Session = Depends(get_db)):
    try:
        admin = db.query(database_models.Admin).filter(
            database_models.Admin.id == admin_id
        ).first()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        return admin

    except HTTPException:
        raise
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Failed to fetch admin")


@app.put("/admins/{admin_id}")
def update_admin(admin_id: int, admin_update: AdminUpdate, db: Session = Depends(get_db)):
    try:
        admin = db.query(database_models.Admin).filter(
            database_models.Admin.id == admin_id
        ).first()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        if admin_update.email:
            existing = db.query(database_models.Admin).filter(
                database_models.Admin.email == admin_update.email,
                database_models.Admin.id != admin_id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")
            admin.email = admin_update.email

        if admin_update.name is not None:
            admin.name = admin_update.name

        if admin_update.password:
            admin.hashed_password = pwd_context.hash(admin_update.password)

        db.commit()
        db.refresh(admin)
        return {"message": "Admin updated successfully", "admin": AdminOut.from_orm(admin)}

    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Admin update failed")


@app.delete("/admins/{admin_id}")
def delete_admin(admin_id: int, db: Session = Depends(get_db)):
    try:
        admin = db.query(database_models.Admin).filter(
            database_models.Admin.id == admin_id
        ).first()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        db.delete(admin)
        db.commit()
        return {"message": "Admin deleted successfully"}

    except HTTPException:
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Admin deletion failed")
