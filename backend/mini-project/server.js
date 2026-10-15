// Assignment 9 Mini Project: REST API using Express to perform CRUD Operations
// Reference: GeeksforGeeks (https://www.geeksforgeeks.org/node-js/rest-api-using-the-express-to-perform-crud-create-read-update-delete/)
// Developed by: Bharvi Bhangale (IT Dept, KBTCOE)

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Data Store (Simulated Database as per GFG Tutorial)
let courses = [
  {
    id: 1,
    title: 'Web Technology (WT)',
    code: 'IT301',
    credits: 4,
    instructor: 'Prof. Sharma',
    enrolledStudents: 68,
  },
  {
    id: 2,
    title: 'Database Management Systems (DBMS)',
    code: 'IT302',
    credits: 4,
    instructor: 'Prof. Kulkarni',
    enrolledStudents: 72,
  },
  {
    id: 3,
    title: 'Operating Systems (OS)',
    code: 'IT303',
    credits: 3,
    instructor: 'Prof. Patil',
    enrolledStudents: 65,
  },
  {
    id: 4,
    title: 'Computer Networks (CN)',
    code: 'IT304',
    credits: 4,
    instructor: 'Prof. Deshmukh',
    enrolledStudents: 70,
  },
];

let nextId = 5;

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Mini Project: Express CRUD REST API',
    reference: 'GeeksforGeeks REST API Tutorial',
    developer: 'Bharvi Bhangale',
    endpoints: {
      getAll: 'GET /api/courses',
      getById: 'GET /api/courses/:id',
      create: 'POST /api/courses',
      update: 'PUT /api/courses/:id',
      delete: 'DELETE /api/courses/:id',
    },
  });
});

// ==========================================
// CRUD OPERATIONS
// ==========================================

// 1. READ ALL (GET /api/courses)
app.get('/api/courses', (req, res) => {
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// 2. READ ONE BY ID (GET /api/courses/:id)
app.get('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: `Course with ID ${courseId} not found.`,
    });
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// 3. CREATE NEW (POST /api/courses)
app.post('/api/courses', (req, res) => {
  const { title, code, credits, instructor, enrolledStudents } = req.body;

  // Validation
  if (!title || !code) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both title and course code.',
    });
  }

  // Check duplicate code
  const existing = courses.find((c) => c.code.toLowerCase() === code.toLowerCase());
  if (existing) {
    return res.status(400).json({
      success: false,
      message: `Course with code ${code} already exists.`,
    });
  }

  const newCourse = {
    id: nextId++,
    title: title.trim(),
    code: code.trim().toUpperCase(),
    credits: Number(credits) || 3,
    instructor: instructor ? instructor.trim() : 'TBD',
    enrolledStudents: Number(enrolledStudents) || 0,
  };

  courses.push(newCourse);

  res.status(201).json({
    success: true,
    message: 'Course created successfully.',
    data: newCourse,
  });
});

// 4. UPDATE (PUT /api/courses/:id)
app.put('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseIndex = courses.findIndex((c) => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Course with ID ${courseId} not found.`,
    });
  }

  const { title, code, credits, instructor, enrolledStudents } = req.body;

  // Update existing course object
  if (title) courses[courseIndex].title = title.trim();
  if (code) courses[courseIndex].code = code.trim().toUpperCase();
  if (credits !== undefined) courses[courseIndex].credits = Number(credits);
  if (instructor) courses[courseIndex].instructor = instructor.trim();
  if (enrolledStudents !== undefined) courses[courseIndex].enrolledStudents = Number(enrolledStudents);

  res.status(200).json({
    success: true,
    message: `Course with ID ${courseId} updated successfully.`,
    data: courses[courseIndex],
  });
});

// 5. DELETE (DELETE /api/courses/:id)
app.delete('/api/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseIndex = courses.findIndex((c) => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Course with ID ${courseId} not found.`,
    });
  }

  const deletedCourse = courses.splice(courseIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: `Course "${deletedCourse.title}" deleted successfully.`,
    data: deletedCourse,
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint does not exist.',
  });
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Mini Project Express CRUD API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
