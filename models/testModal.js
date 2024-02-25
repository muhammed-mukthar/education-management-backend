const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema
const classTestSchema = new Schema({
  name: {
    type: String,
  },
  course: {
    type: String,
    default: "bca",
  },
  teacher: {
    type: String,
  },
  teacherId: {
    type: String,
  },
});

// Create and export the model
const classTest = mongoose.model("classTest", classTestSchema);
module.exports = classTest;
