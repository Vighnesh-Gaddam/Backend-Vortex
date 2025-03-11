import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "express-async-handler";
import {User} from "../models/user.models.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {

    // const token = req.cookies.accessToken || req.headers.("Authorization").replace("Bearer ", "");
    const token = req.cookies.accessToken || req.headers.Authorization.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Access token not found");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        req.user = user
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized");
    }

    next()
})