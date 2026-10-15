# Web Technology Lab Backend & Mini Project

Developed by: **Bharvi Bhangale**  
Department: **Information Technology, KBTCOE Nashik**

---

## 📌 Contents
1. **Assignment 8**: Node.js, Express.js & MongoDB Student Records REST API (Full CRUD + Postman Collection)
2. **Assignment 9**: Mini Project — REST API using Express CRUD Operations (GeeksforGeeks Reference)

---

## 🚀 Assignment 8: Student Records REST API

### Features
- **Database**: MongoDB with Mongoose schema & pre-save hooks.
- **Auto Computations**: Automatically calculates `totalMarks`, `percentage`, letter `grade`, and pass/fail `status`.
- **Topper Identification**: Analyzes batch records and extracts the top scoring student.
- **REST Endpoints**:
  - `GET /api/students` — Retrieve all students with optional sorting and filters.
  - `GET /api/students/:id` — Retrieve specific student details.
  - `POST /api/students` — Register a student with subject marks.
  - `PUT /api/students/:id` — Update student information or marks.
  - `DELETE /api/students/:id` — Remove student record.

### Quick Start
```bash
cd backend
npm install
npm start
```
Server runs at `http://localhost:5000`.

### Postman Testing
1. Open Postman.
2. Click **Import** > Select `Student_Records_API.postman_collection.json`.
3. Execute and test each pre-configured request with automated assertions.

---

## 🌟 Assignment 9: Express CRUD Mini Project

Based on the official [GeeksforGeeks Node.js REST API using Express Tutorial](https://www.geeksforgeeks.org/node-js/rest-api-using-the-express-to-perform-crud-create-read-update-delete/).

### Features
- In-memory data store for courses and curriculum items.
- Full CRUD operations with HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
- Real-time interactive frontend available directly in the portfolio website (`assignments.html#tab-assign9`).

### Quick Start
```bash
cd backend/mini-project
npm install
npm start
```
Server runs at `http://localhost:4000`.
