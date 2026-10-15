const Student = require('../models/Student');

// @desc    Get all student records (Read All)
// @route   GET /api/students
// @access  Public
exports.getAllStudents = async (req, res) => {
  try {
    const { department, status, sortBy } = req.query;
    let query = {};

    if (department) query.department = department;
    if (status) query.status = status;

    let studentsQuery = Student.find(query);

    if (sortBy === 'percentage') {
      studentsQuery = studentsQuery.sort({ percentage: -1 });
    } else {
      studentsQuery = studentsQuery.sort({ createdAt: -1 });
    }

    const students = await studentsQuery;

    // Identify batch topper if records exist
    let topper = null;
    if (students.length > 0) {
      topper = [...students].sort((a, b) => b.percentage - a.percentage)[0];
    }

    res.status(200).json({
      success: true,
      count: students.length,
      topper: topper ? { name: topper.name, rollNumber: topper.rollNumber, percentage: topper.percentage } : null,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch students',
      error: error.message,
    });
  }
};

// @desc    Get single student by ID (Read Single)
// @route   GET /api/students/:id
// @access  Public
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error: Invalid ID or database error',
      error: error.message,
    });
  }
};

// @desc    Create new student record (Create)
// @route   POST /api/students
// @access  Public
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error: A student with this roll number or email already exists.',
      });
    }
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.message,
    });
  }
};

// @desc    Update student record (Update)
// @route   PUT /api/students/:id
// @access  Public
exports.updateStudent = async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with id ${req.params.id}`,
      });
    }

    // Merge updates and recalculate fields
    Object.assign(student, req.body);
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Update validation error',
      error: error.message,
    });
  }
};

// @desc    Delete student record (Delete)
// @route   DELETE /api/students/:id
// @access  Public
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Student ${student.name} (${student.rollNumber}) deleted successfully`,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message,
    });
  }
};
