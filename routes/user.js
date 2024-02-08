const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=    require("../middleware.js");
const userController = require("../controllers/users.js");


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Render Signup form)
router.get("/signup",userController.renderSignupForm);
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Submit Form POST(SIGNUP))
router.post("/signup",
wrapAsync
(userController.signup)
)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Login)
router.get("/login",userController.renderLoginForm);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (User login check user register or not )
// Using middleware passport check authenticate or not
router.post("/login",
saveRedirectUrl,
passport.authenticate("local",{
failureRedirect:"/login",
failureFlash:true,
}),
userController.login
);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (Logout user)
router.get("/logout",userController.logout)
module.exports = router;