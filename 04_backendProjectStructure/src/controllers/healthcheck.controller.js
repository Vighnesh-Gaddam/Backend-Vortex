import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "express-async-handler"


const healthcheck = asyncHandler( async(req,res)=>{
    console.log("healthcheck")
    return res
        .status(200)
        .json(new ApiResponse(200, "OK", "Health Check Passed"))
})

export {healthcheck}