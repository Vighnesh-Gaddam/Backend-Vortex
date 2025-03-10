import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([{name: "avatar", maxCount: 1}, {name: "coverPage", maxCount: 1}]),
    registerUser)

// router.route("/register").get(registerUser)

export default router