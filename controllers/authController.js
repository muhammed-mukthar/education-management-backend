const { default: mongoose, mongo } = require("mongoose");
const errorHandler = require("../middlewares/errorMiddleware");
const QuizOptions = require("../models/QuizModal");
const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");
const MarkSheet = require("../models/MarkSheet");
const classTest = require("../models/testModal");
const TestResult = require("../models/TestResult");
const sendEmail = require("../config/email");
const FileModal = require("../models/FileModal");

// JWT TOKEN
exports.sendToken = (user, statusCode, res) => {
  try {
    const token = user.getSignedToken(res);
    console.log(token, "tokent");
    console.log(user, token, "this is token");
    res.status(statusCode).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

//REGISTER
exports.registerContoller = async (req, res, next) => {
  try {
    const { username, email, password, parentsEmail, role, course } = req.body;
    //exisitng user
    const exisitingEmail = await userModel.findOne({ email });
    if (exisitingEmail) {
      return res.status(500).json({
        success: false,
        message: "email  already exist",
      });
    }
    const user = await userModel.create({
      username,
      email,
      password,
      parentsEmail,
      role,
      course,
    });
    req.userid = user.id;

    this.sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//LOGIN
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).json("email password required");
    }
    const user = await userModel.findOne({ email });
    console.log(user, "user");
    if (!user) {
      return res.status(500).json({ error: "Invalid Credentials" });
    }
    if (!user.verify) {
      return res.status(500).json({ error: "You are not verified" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    //res
    this.sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

//LOGOUT
exports.logoutController = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logged out Succesfully",
  });
};

exports.userListController = async (req, res, next) => {
  try {
    const userData = await userModel.find();
    console.log(userData);
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.teacherListController = async (req, res, next) => {
  try {
    const userData = await userModel.find({
      role: { $in: ["teacher", "batch"] },
    });
    console.log(userData);
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.studentListController = async (req, res, next) => {
  try {
    const userData = await userModel.find({
      role: "student",
    });
    console.log(userData);
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.studentUsersController = async (req, res, next) => {
  try {
    let teacherData = req.user;
    const userData = await userModel.find({
      role: "student",
      course: teacherData?.course,
    });

    console.log(userData, teacherData, "teacherData");
    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.createQuizController = async (req, res, next) => {
  try {
    const quizOption = new QuizOptions(req.body.quizOptions);
    await quizOption.save();
    res.status(201).json(quizOption);
  } catch (error) {
    console.error("Error creating quiz option:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.listQuizController = async (req, res, next) => {
  try {
    let testId = req.params.id;
    let QuizData = await QuizOptions.find({ testId: testId });
    res.status(201).json(QuizData);
  } catch (error) {
    console.error("Error creating quiz option:", error);
    res.status(500).send("Internal Server Error");
  }
};

exports.acceptUserController = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await userModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      { $set: { verify: true } }
    );
    const userData = await userModel
      .findOne({
        _id: mongoose.Types.ObjectId(userId),
      })
      .lean();
    const to = userData.email; // Parent's email address
    const subject = "Registration Accepted";
    const placeholders = {
      title: "Registration Accepted",
      body: "Hello, we are pleased to inform you that your account has been activated log into your account to continue ",
      ctaText: "Login Now",
      ctaLink: "http://localhost:3000/login",
    };

    sendEmail(to, subject, placeholders);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error accepting user:", error);
    res.status(500).send("Error accepting user");
  }
};

exports.DeleteUserController = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await userModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId(userId),
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error Deleting user:", error);
    res.status(500).send("Error Deleting user");
  }
};
exports.rejectUserController = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const user = await userModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(userId),
      },
      { $set: { isRejected: true } }
    );
    const userData = await userModel
      .findOne({
        _id: mongoose.Types.ObjectId(userId),
      })
      .lean();
    const to = userData.email; // Parent's email address
    const subject = "Registration Rejected";
    const placeholders = {
      title: "Registration Rejected",
      body: "Hello, we want to inform you that your account has been Rejected by the admin ",
      ctaText: "User Rejected",
      ctaLink: "http://localhost:3000/login",
    };
    sendEmail(to, subject, placeholders);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error accepting user:", error);
    res.status(500).send("Error accepting user");
  }
};
//marks controller

exports.createMarksController = async (req, res, next) => {
  try {
    let userData = req.user;
    const { subject, mark, userId } = req.body;
    const Mark = await MarkSheet.create({
      subject,
      mark,
      userId: userId,
    });

    console.log(userData, Mark, "Mark");
    return res.status(200).json(Mark);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getMarksParamsController = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const Mark = await MarkSheet.find(
      {
        userId: new mongoose.Types.ObjectId(userId),
      },
      { subject: 1, mark: 1 }
    );
    const userData = await userModel
      .findOne({
        _id: mongoose.Types.ObjectId(userId),
      })
      .lean();

    let data = [];

    for (const element of Mark) {
      data.push({
        name: userData?.username,
        subject: element?.subject,
        mark: element?.mark,
        total: 100,
      });
    }
    console.log(userId, Mark, "Mark");
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getMarksController = async (req, res, next) => {
  try {
    let userData = req.user;
    const Mark = await MarkSheet.find({
      userId: userData._id,
    });

    console.log(userData, Mark, "Mark");
    return res.status(200).json(Mark);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.editMarksController = async (req, res, next) => {
  try {
    let userData = req.user;
    const { mark, markId } = req.body;
    const Mark = await MarkSheet.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(markId) },
      {
        $set: { mark: mark },
      }
    );

    console.log(userData, Mark, "Mark");
    return res.status(200).json(Mark);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteMarksController = async (req, res, next) => {
  try {
    let userData = req.user;
    const markId = req.params.id;
    const Mark = await MarkSheet.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(markId),
    });

    console.log(userData, Mark, "Mark");
    return res.status(200).json(Mark);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//tests
exports.deleteTestController = async (req, res, next) => {
  try {
    let userData = req.user;
    const testId = req.params.id;
    const Tests = await classTest.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(testId),
    });

    console.log(userData, Tests, "Mark");
    return res.status(200).json(Tests);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.createTestsController = async (req, res, next) => {
  try {
    let userData = req.user;
    const { name, course, teacher } = req.body;
    const result = await classTest.create({
      name,
      course: userData.course,
      teacher: userData.username,
      teacherId: userData?._id,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getTestsByTeacherController = async (req, res, next) => {
  try {
    let userData = req.user;
    const result = await classTest.find({
      teacherId: userData._id,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getTestsBySubjectController = async (req, res, next) => {
  try {
    let userData = req.user;
    const result = await classTest.find({
      course: userData?.course,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//result

exports.createTestResultController = async (req, res, next) => {
  try {
    let userData = req.user;
    const { marks, testId } = req.body;
    const result = await TestResult.create({
      marks,
      testId: testId,
      student: userData.username,
      studentId: userData?._id,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getTestsResultsController = async (req, res, next) => {
  try {
    let userData = req.user;
    let testId = req.params.id;
    const result = await TestResult.find({
      testId: testId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.sendEmailController = async (req, res, next) => {
  try {
    let userId = req.body.userId;
    const userData = await userModel.findOne({
      _id: mongoose.Types.ObjectId(userId),
    });
    console.log(userData, "isers");
    const to = userData.parentsEmail; // Parent's email address
    const subject = "Mark List Update";
    const placeholders = {
      title: "Mark List Update",
      body: "Hello, we are pleased to inform you that the mark list for your child has been updated. You can now review your child's performance. Please login to your child's account to view the updated mark list. If you have any questions or concerns, feel free to contact us. Thank you! Sincerely, Your School Administration",
      ctaText: "Login Now",
      ctaLink: "http://localhost:3000/login",
    };

    sendEmail(to, subject, placeholders);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.fileUploadController = async (req, res) => {
  try {
    let userData = req.user;

    const newFile = new FileModal({
      user: userData._id, // Assuming you have user ID in the request body
      filename: req.file.originalname,
      teacher: userData.username,
      course: userData.course,
      path: req.file.path,
    });
    await newFile.save();
    res.send("File uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.downloadFileController = async (req, res) => {
  try {
    const file = await FileModal.findById(req.params.id);
    res.download(file.path);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
exports.getAllStudentFiles = async (req, res) => {
  try {
    // Fetch files from the database
    let userData = req.user;

    const files = await FileModal.find({ course: userData.course });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTeacherFiles = async (req, res) => {
  try {
    // Fetch files from the database
    const files = await FileModal.find();
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.deleteFiles = async (req, res) => {
  try {
    const fileId = req.params.id;
    // Fetch files from the database
    const files = await FileModal.findOneAndDelete({
      _id: mongoose.Types.ObjectId(fileId),
    });
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Server error" });
  }
};
