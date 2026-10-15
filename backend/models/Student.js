const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Information Technology', 'Computer Engineering', 'AIDS', 'Electronics', 'Mechanical'],
      default: 'Information Technology',
    },
    marks: {
      webTech: { type: Number, required: true, min: 0, max: 100 },
      dbms: { type: Number, required: true, min: 0, max: 100 },
      operatingSystems: { type: Number, required: true, min: 0, max: 100 },
      computerNetworks: { type: Number, required: true, min: 0, max: 100 },
      softwareEng: { type: Number, required: true, min: 0, max: 100 },
    },
    totalMarks: {
      type: Number,
    },
    percentage: {
      type: Number,
    },
    grade: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pass', 'Fail'],
      default: 'Pass',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate total, percentage, grade, and status automatically
studentSchema.pre('save', function (next) {
  if (this.marks) {
    const { webTech, dbms, operatingSystems, computerNetworks, softwareEng } = this.marks;
    this.totalMarks = Number(webTech) + Number(dbms) + Number(operatingSystems) + Number(computerNetworks) + Number(softwareEng);
    this.percentage = Number((this.totalMarks / 5).toFixed(2));

    const minPassing = 40;
    const isFailed = [webTech, dbms, operatingSystems, computerNetworks, softwareEng].some((m) => m < minPassing);

    if (isFailed) {
      this.status = 'Fail';
      this.grade = 'F';
    } else {
      this.status = 'Pass';
      if (this.percentage >= 85) this.grade = 'O (Outstanding)';
      else if (this.percentage >= 75) this.grade = 'A+ (Distinction)';
      else if (this.percentage >= 65) this.grade = 'A (First Class)';
      else if (this.percentage >= 55) this.grade = 'B+ (Higher Second Class)';
      else if (this.percentage >= 50) this.grade = 'B (Second Class)';
      else this.grade = 'C (Pass Class)';
    }
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
