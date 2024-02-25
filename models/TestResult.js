const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema
const TestResultSchema = new Schema({
  testId: {
    type: String,
  },
  student: {
    type: String,
    default: "bca",
  },
  studentId: {
    type: String,
  },
  marks: {
    type: Number,
  },
});

// Create and export the model
const TestResult = mongoose.model("TestResult", TestResultSchema);
module.exports = TestResult;
