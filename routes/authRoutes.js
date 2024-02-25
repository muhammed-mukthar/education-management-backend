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
} = require("../controllers/authController");
const protect = require("../middlewares/autherisationMiddleware");

//router object
const router = express.Router();

//routes
// REGISTER
router.post("/register", registerContoller);

//LOGIN
router.post("/login", loginController);

//LOGOUT
router.post("/logout", logoutController);

router.post("/list", userListController);
router.post("/create-quiz", createQuizController);
router.post("/list-quiz", listQuizController);

//user management

router.post("/accept/:id", acceptUserController);

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

module.exports = router;
