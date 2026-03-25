# 🚀 Employee Shift Management System

A full-stack web application designed to automate employee scheduling, manage workforce efficiently, and reduce manual errors in shift planning.

---

## 📌 Features

### 👨‍💼 Admin Module

* Create, update, and delete users
* Assign roles (Admin, Manager, Employee)
* Monitor system activities
* Manage system-level configurations

---

### 🧑‍💼 Employee Management

* Add and manage employee records
* Track employee availability
* Assign employees to managers
* Maintain employee work details

---

### 👤 User Management

* Secure authentication (Login/Register)
* Role-based access control (RBAC)
* JWT-based authorization
* Password encryption

---

### 📅 Shift Management

* Create and manage shifts
* Define shift timings (Morning, Evening, Night)
* Assign employees to shifts
* Avoid overlapping schedules

---

### 🤖 Auto Shift Scheduling

* Automatically assign shifts based on:

  * Availability
  * Workload balance
  * Role/skills
* Ensures fair distribution of work

---

### 🔄 Shift Change System

* Employees request shift change request
* Manager approval/rejection
* Automatic schedule updates

---

### 📝 Leave Management

* Apply for leave
* Manager approval workflow
* Auto removal from assigned shifts
* Real-time schedule update

---

### 📊 Dashboard & Analytics

* Workload tracking
* Overtime monitoring
* Shift coverage insights
* Understaffed alerts

---

### 🔔 Notifications

* Shift updates
* Leave approvals/rejections
* Swap request updates

---

## 🎨 Frontend (React)

### 🛠️ Tech Stack

* React.js
* Vite
* Tailwind CSS
* Axios

---

### 📂 Structure

```
frontend/
│
├── src/
│   ├── components/
│   ├── Pages/
│   │   ├── Admin/
│   │   ├── Employee/
│   │   └── Manager/
│   └── App.jsx
```

---

### ⚙️ Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on: http://localhost:5173

---

### 🔗 API Connection

Make sure backend is running on:

```
http://localhost:8080
```

---

## ⚙️ Backend (Spring Boot)

### 🛠️ Tech Stack

* Java 17
* Spring Boot
* Spring Security
* JPA / Hibernate
* MySQL

---

### 📂 Structure

```
backend/
│
├── controller/
├── service/
├── repository/
├── model/
├── dto/
├── exception/
├── config/
└── filters/
```

---

### ⚙️ Setup

#### Configure Database

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shift_db
spring.datasource.username=root
spring.datasource.password=your_password
```

---

#### Run Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on: http://localhost:8080

---

### 🔗 API Modules

* `/api/auth` → Authentication
* `/api/users` → User Management
* `/api/employees` → Employee Management
* `/api/shifts` → Shift Management
* `/api/leave` → Leave Requests
* `/api/swap` → Shift Swap

---

## 🔐 Security

* JWT-based authentication
* Role-based authorization
* Secure REST APIs

---

## 🚀 Future Enhancements

* AI-based scheduling
* Mobile app
* Email/SMS notifications
* Microservices architecture

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 👨‍💻 Author

Harshal Belgamwar

LinkedIn: https://www.linkedin.com/in/harshal-belgamwar

GitHub: https://github.com/Harshal-belgamwar

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
