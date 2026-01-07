# 🏬 Warehouse Management System

A full-stack Warehouse Management System built to efficiently manage products, inventory, and administrative users.  
The application provides a secure admin dashboard for handling warehouse operations with real-time updates.

---

## 🚀 Features

### 🔐 Admin Authentication
- Admin registration and login
- Secure password hashing using **bcrypt**
- Protected admin dashboard access

### 📦 Product Management
- Add, update, delete, and view products
- Track:
  - Product name
  - Description
  - Price
  - Quantity
  - Company
  - Delivery partner
- Low-stock alerts (quantity < 10)

### 👥 Admin Management
- View all admin users
- Add or delete admins
- Prevent duplicate email registration

### 📊 Dashboard Overview
- Total number of products
- Active admins count
- Low inventory notifications

### 🎨 Modern UI
- Responsive UI using **Material-UI**
- State management with **Redux Toolkit**
- Toast notifications using **Notistack**

---

## 🛠 Tech Stack

### Backend
- **FastAPI** – High-performance Python web framework
- **SQLAlchemy** – ORM for database interaction
- **MySQL** – Relational database
- **Passlib (bcrypt)** – Password hashing
- **Uvicorn** – ASGI server

### Frontend
- **React.js**
- **Redux Toolkit**
- **Material-UI (MUI)**
- **Axios**


---

## ⚙️ Installation & Setup

### 1️⃣ Backend Setup

```bash
cd backend
python -m venv myenv
myenv\Scripts\activate   # Windows
pip install -r requirements.txt
db_url = "mysql+pymysql://username:password@localhost:3306/warehouse_management"
Run the server: uvicorn main:app --reload
```
#### 2 Frontend Setup
```bash
cd frontend
npm install
npm start
```


## 📂 Project Structure

