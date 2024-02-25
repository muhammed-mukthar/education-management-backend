const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema
const MarkSheetSchema = new Schema({
  subject: {
    type: String,
  },
  mark: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
  },
});

// Create and export the model
const MarkSheet = mongoose.model("MarkSheet", MarkSheetSchema);
module.exports = MarkSheet;
