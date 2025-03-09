import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar: {
        type: String,
        // default: "https://res.cloudinary.com/dwq4yjw0o/image/upload/v1685672243/Avatar/Avatar_1.png"
        required: true
    },
    coverImage: {
        type: String
    },
    refreshToken: {
        type: String
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }]
}, {
    timestamps: true
})

/*--------------------------------*/ 

// Mongoose pre-save hook to hash the password before saving the user document
userSchema.pre("save", async function (next) {
    // Check if the password field has been modified
    if (!this.isModified("password")) return next();  // If password is not changed, skip hashing and proceed

    // Hash the new password before saving
    this.password = await bcrypt.hash(this.password, 10);  // Hash the password

    next();  // Proceed to save the document after hashing
});


userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

/*--------------------------------*/ 


// Method to generate an access token for a user       "SYNTAX:- jwt.sign(payload, secret, options)"
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,          // Unique user ID from MongoDB
            email: this.email,      // User's email for authentication
            username: this.username,// Username of the user
            fullname: this.fullname // Full name of the user
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret key used to sign the token
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Token expiration time
    );
};


// Method to generate a refresh token for a user
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id  // Unique user ID from MongoDB (used to identify the user)
        },
        process.env.REFRESH_TOKEN_SECRET, // Secret key used to sign the refresh token
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Token expiration time (longer duration than access token)
    );
};


/*--------------------------------*/ 





export const User = mongoose.model("User", userSchema)