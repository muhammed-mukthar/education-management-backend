const express = require("express");
const {
  registerContoller,
  loginController,
  logoutController,
  userListController,
  createQuizController,
  listQuizController,
  acceptUserController,
  studentUsersController,
  createMarksController,
  getMarksController,
  editMarksController,
  deleteMarksController,
  getMarksParamsController,
  createTestsController,
  getTestsByTeacherController,
  getTestsBySubjectController,
  deleteTestController,
  createTestResultController,
  getTestsResultsController,
  sendEmailController,
  downloadFileController,
  fileUploadController,
  getAllTeacherFiles,
  getAllStudentFiles,
  deleteFiles,
  rejectUserController,
  teacherListController,
  studentListController,
  DeleteUserController,
  promoteUserToBranchController,
  unPromoteUserToBranchController,
  deleteQuizController,
} = require("../controllers/authController");
const protect = require("../middlewares/autherisationMiddleware");
const path = require("path");
const upload = require("../config/multerConfig");

//router object
const router = express.Router();

//routes
// REGISTER
router.post("/register", registerContoller);

//LOGIN
router.post("/login", loginController);

//LOGOUT
router.post("/logout", logoutController);

router.post("/create-quiz", createQuizController);
router.delete("/quiz/:id", deleteQuizController);

router.post("/list-quiz/:id", listQuizController);

//user management
router.post("/list", userListController);
router.post("/teacher", teacherListController);
router.post("/student", studentListController);
router.post("/accept/:id", acceptUserController);
router.post("/reject/:id", rejectUserController);
router.delete("/user/:id", DeleteUserController);
router.post("/promote/:id", promoteUserToBranchController);
router.post("/unpromote/:id", unPromoteUserToBranchController);

//teaher

router.post("/marks/users", protect, studentUsersController);

//marks

router.post("/marks/create", protect, createMarksController);
router.put("/marks/edit", protect, editMarksController);
router.get("/marks/all", protect, getMarksController);
router.get("/mark-list/:id", protect, getMarksParamsController);

router.delete("/marks/delete/:id", protect, deleteMarksController);

//tests
router.post("/tests/create", protect, createTestsController);
router.get("/teacher-tests", protect, getTestsByTeacherController);
router.get("/subject-tests", protect, getTestsBySubjectController);
router.delete("/tests/delete/:id", protect, deleteTestController);

//testResult
router.post("/result/create", protect, createTestResultController);
router.get("/test-result/:id", protect, getTestsResultsController);

//SEND EMAIL

router.post("/send-email", protect, sendEmailController);
router.post("/upload", protect, upload.single("file"), fileUploadController);
router.get("/download/:id", downloadFileController);
router.get("/files", protect, getAllTeacherFiles);
router.delete("/file/:id", protect, deleteFiles);
router.get("/student/files", protect, getAllStudentFiles);
//file upload
module.exports = router;
