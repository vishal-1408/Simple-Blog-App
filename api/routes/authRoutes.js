const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers")
const auth  = require("../middlewares/authenticate");

router.post("/register",authControllers.register)


router.post("/login",authControllers.login)


router.post("/logout",auth,authControllers.logout)

router.post("/logoutAll",auth,authControllers.logoutAll)



module.exports = router;