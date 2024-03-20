import { Schema, model } from 'mongoose';


const UserSchema = new Schema({
    firstName: {
        type: String,
        minLength: [3, "Firstname is too short"],
        maxLength: [15, "Firstname is too long"],
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        minLength: [3, "Lastname is too short"],
        maxLength: [15, "Lastname is too long"],
        trim: true,
        required: true
    },
    username: { // Automatic entry
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minLength: [10, "Password is too short"],
        required: true
    },
    recoveryEmail: {
        type: String,
        trim: true,
        required: true
    },
    DOB: {
        type: String,
        match: /^(19[0-9]{2}|200[0-5])-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[01])$/,
        required: true
        //FLAG
    },
    mobileNumber: {
        type: String,
        length: 11,
        unique: true,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: {
            values: ["User", "Company_HR"],
            message: "Invalid role, user must be either 'User' or 'Company_HR'"
        },
        trim: true,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["online", "offline"],
            message: "Invalid status, only 'online' or 'offline' is permitted"
        },
        default: "offline",
        trim: true
    },
    email_isVerified: {
        type: Boolean,
        default: false
    },
    recoveryEmail_isVerified: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
});


export const UserModel = model("User", UserSchema);