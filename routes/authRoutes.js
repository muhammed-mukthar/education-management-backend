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

router.get("/mark-list", protect, getMarksController);
router.delete("/marks-list/:id", protect, deleteMarksController);

module.exports = router;
