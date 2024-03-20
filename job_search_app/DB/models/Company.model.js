import { Schema, model, Types } from 'mongoose';


const CompanySchema = new Schema({
    companyName: {
        type: String,
        minLength: [3, "Company name is too short"],
        unique: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        minLength: [20, "Description is too short"],
        trim: true,
        required: true
    },
    industry: {
        type: String,
        minLength: [5, "Industry is too short"],
        trim: true,
        required: true
        //FLAG
    },
    address: {
        type: String,
        minLength: [10, "Address is too short"],
        trim: true,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        min: 11,
        max: 20,
        required: true,
    },
    companyEmail: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    companyHR: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    companyEmail_isVerified: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});


export const CompanyModel = model("Company", CompanySchema);