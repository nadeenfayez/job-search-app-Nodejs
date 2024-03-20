import { Schema, model, Types } from 'mongoose';


export const JobSchema = new Schema({
    jobTitle: {
        type: String,
        minLength: [3, "Job title is too short"],
        trim: true,
        required: true
        //FLAG
    },
    jobLocation: {
        type: String,
        enum: {
            values: ["onsite", "remotely", "hybrid"],
            message: "Invalid job location, it must be either 'onsite', 'remotely', or 'hybrid'"
        },
        trim: true,
        required: true
    },
    workingTime: {
        type: String,
        enum: {
            values: ["part-time", "full-time"],
            message: "Invalid working time, it must be either 'part-time' or 'full-time'"
        },
        trim: true,
        required: true
    },
    seniorityLevel: {
        type: String,
        enum: {
            values: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
            message: "Invalid seniority level, it must be either 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', or 'CTO'"
        },
        trim: true,
        required: true
    },
    jobDescription: {
        type: String,
        minLength: [20, "Job description is too short"],
        trim: true,
        required: true
    },
    technicalSkills: {
        type: [String],
        required: true
    },
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: Types.ObjectId,
        ref: "Company",
        foreignField: "companyHR",
        required: true
    },
    companyId: {
        type: Types.ObjectId,
        ref: "Company",
        required: true
    }
},
{
    toJSON: {virtuals: true}, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: {virtuals: true}, // So `console.log()` and other functions that use `toObject()` include virtuals
    id: false,
    timestamps: true
});

JobSchema.virtual("company", { // On the fly field
    ref: "Company",
    localField: "companyId",
    foreignField: "_id",
});


export const JobModel = model("Job", JobSchema);