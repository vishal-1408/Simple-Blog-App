const express = require("express");
const router = express.Router();
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth  = require("../middlewares/authenticate");
const authControllers = require("../controllers/authControllers.js");

router.post("/register",authControllers.register)


router.post("/login",authControllers.login)


router.post("/logout",auth,authControllers.logout)

router.post("/logoutAll",auth,authControllers.logoutAll)



module.exports = router;