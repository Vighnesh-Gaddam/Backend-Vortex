import {Router} from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([{name: "avatar", maxCount: 1}, {name: "coverPage", maxCount: 1}]),
    registerUser)

// SecuredRoute
router.route("/login").post(verifyJWT, loginUser) 


// router.route("/register").get(registerUser)

export default router