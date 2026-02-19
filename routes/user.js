const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl, saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js");


router.route("/signup")
.get(userController.renderSingupPage)
.post(wrapAsync(userController.signup));

router.route("/login")
.get( userController.renderLoginPage)
.post( saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true }) , userController.login);

router.get("/logout", userController.logout)

module.exports = router;