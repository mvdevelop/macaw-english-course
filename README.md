
# Macaw English School

Macaw English School is a comprehensive school management platform featuring a student-facing portal, an administrative dashboard, and a robust .NET-based backend.

## 📂 Project Structure

This repository is organized as a monorepo:

- **`/backend`**: .NET 8 Web API providing RESTful services and MongoDB integration.
- **`/frontend`**: Modern student-facing website built with React and Tailwind CSS.
- **`/admin`**: Administrative dashboard for school management built with React, TypeScript, and Redux.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET 8 Web API
- **Database**: MongoDB Atlas
- **Patterns**: Repository Pattern, Service Layer
- **Documentation**: Swagger UI
- **Features**: Basic Authentication, Custom Middleware (Logging & Error Handling), CORS (AllowAll)

### Frontend (Student Portal)
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Scrolling**: Lenis (Smooth Scroll)
- **Navigation**: React Router 7

### Admin Dashboard
- **Framework**: React 19 (Vite, TypeScript)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Notifications**: React Toastify

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js (LTS)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/MacawEnglishSchool.API
   ```
2. Configure your database connection in `appsettings.json`:
   ```json
   "MongoDb": {
     "ConnectionString": "your_mongodb_connection_string",
     "DatabaseName": "macaw_english_school"
   }
   ```
3. Restore and run the API:
   ```bash
   dotnet restore
   dotnet run
   ```
4. The API will be available at `http://localhost:5196` (or `https://localhost:7193`). Access Swagger documentation at `/swagger`.

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Admin Setup
1. Navigate to the admin directory:
   ```bash
   cd admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📖 API Documentation

The backend includes integrated Swagger documentation. When the API is running in development mode, you can explore and test the endpoints at:
`http://localhost:5196/swagger`

---

## 🗄️ Database Information

The project uses **MongoDB** for data persistence. Ensure you have a valid connection string to a MongoDB Atlas cluster or a local instance. The backend uses a Repository Pattern to abstract data operations for Students, Courses, and Users.

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE.txt](./LICENSE.txt) file.
