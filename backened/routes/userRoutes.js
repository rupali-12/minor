// Write all routes related to user 
const express = require("express");
const router =express.Router()
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const {protect}= require("../middlewares/authMiddleware");

// end point for registration aand for search user 
router.route("/").post(registerUser).get(protect ,allUsers);
// end point for login
router.post('/login', authUser);
module.exports=router;