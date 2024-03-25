const mongoose = require("mongoose");

//model
const FileModalSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    teacher: {
      type: String,
    },
    course: {
      type: String,
    },
    subject: {
      type: String,
    },
    filename: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FileModal = mongoose.model("FileModal", FileModalSchema);

module.exports = FileModal;
