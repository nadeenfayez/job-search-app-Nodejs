import { Schema, model, Types } from 'mongoose';


const ApplicationSchema = new Schema({
    jobId: {
        type: Types.ObjectId,
        ref: "Job",
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    userTechSkills: {
        type: [String],
        required: true
    },
    userSoftSkills: {
        type: [String],
        required: true
    },
    userResume: {
        type: String,
        unique: true,
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

ApplicationSchema.virtual("user_data", { // On the fly field
    ref: "User",
    localField: "userId",
    foreignField: "_id",
});


export const ApplicationModel = model("Application", ApplicationSchema);