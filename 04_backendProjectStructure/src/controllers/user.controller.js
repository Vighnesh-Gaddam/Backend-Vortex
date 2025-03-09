import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "express-async-handler"
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import {v2 as cloudinary} from "cloudinary"

import bcrypt from "bcrypt"

const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, username, password } = req.body
    //console.log("Register User " + fullName, email, username, password)

    //validation (can use any libraby example ZOD, JOI, YUP, etc. )
    if (!fullname || !email || !username || !password) {
        throw new ApiError(400, "Missing Fields", "Please fill all the fields")
    }


    // check if user already exists
    const userExists = await User.findOne({
        $or: [{ username }, { email }] // search for username or email
    })
    if (userExists) {
        throw new ApiError(400, "User Already Exists", "User with this email already exists")
    }




    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverPage?.[0]?.path;


    if (!avatarLocalPath) {
        console.log("avatarLocalPath", avatarLocalPath)
        throw new ApiError(400, "Avatar Not Found", "Please upload avatar ")
    }

    let avatar;
    try {
        avatar = await uploadOnCloudinary(avatarLocalPath)
        console.log("avatar", avatar)
    } catch (error) {
        console.log("Error uplaoding avatar", error)
        throw new ApiError(500, "Avatar Upload Failed", "Failed to upload avatar to Cloudinary");
    }

    let coverImage;
    if (coverLocalPath) {
        try {
            coverImage = await uploadOnCloudinary(coverLocalPath)
            console.log("coverImage", coverImage)
        } catch (error) {
            console.log("Error uplaoding coverImage", error)
            throw new ApiError(500, "Cover Image Upload Failed", "Failed to upload cover image to Cloudinary");
        }
    }


    try {
        const user = await User.create({
            fullname,
            email,
            username: username.toLowerCase(),
            password,
            avatar: avatar.url,
            coverPage: coverImage ? coverImage.url : ""
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong in creating user", "Something went wrong in creating user")
        }

        return res
            .status(200).
            json(new ApiResponse(200, "User Registered Successfully", createdUser))
    } catch (error) {
        console.log("User Creation Failed", error)
        if (avatar?.public_id) {
            await cloudinary.uploader.destroy(avatar.public_id);
        }
        if (coverImage?.public_id) {
            await cloudinary.uploader.destroy(coverImage.public_id);
        }
        throw new ApiError(500, "Something went wrong in creating user", "Something went wrong in creating user and Images were Deleted")
    }
})

export { registerUser }