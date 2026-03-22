const { Router } = require("express");
const { register, loginUser, getMe } = require("../controller/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");


const router = Router();

router.post("/register",register);

router.post("/login", loginUser)


router.get("/get-me",authUser,getMe)
module.exports = router;