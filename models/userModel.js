const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cookie = require("cookie");
const MarkSheet = require("./MarkSheet");

//model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
    minLength: [6, "Password length should be grater than 6 characters"],
  },
  role: {
    type: String,
    default: "student",
  },
  course: {
    type: String,
    default: "BCA",
  },
  subject: {
    type: String,
  },
  parentsEmail: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
});

// hashed password before saving (pre)
userSchema.pre("save", async function (next) {
  //update
  if (!this.isModified("password")) {
    next();
  }
  // hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// match password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// SIGN TOKEN
userSchema.methods.getSignedToken = function (res) {
  const accessToken = JWT.sign(
    {
      id: this._id,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIREIN,
    }
  );

  const refreshToken = JWT.sign(
    {
      id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIREIN,
    }
  );

  return { accessToken, refreshToken };
};
// Middleware to create mark sheets for new users
userSchema.post("save", async function (doc, next) {
  if (doc.role !== "student") {
    // If the user role is not student, skip mark sheet creation
    return next();
  }
  const subjects = [
    "physics",
    "chemistry",
    "biology",
    "english",
    "malayalam",
    "social_science",
    "maths",
  ];

  // Create a mark sheet for each subject with marks initialized to 0
  try {
    for (const subject of subjects) {
      await MarkSheet.create({
        subject: subject,
        mark: 0,
        userId: doc._id,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
