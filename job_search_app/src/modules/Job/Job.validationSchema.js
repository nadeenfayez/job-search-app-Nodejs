import Joi from 'joi';


const addJobSchema = Joi.object({
    jobTitle: Joi.string().trim().min(3).required(),
    jobLocation: Joi.string().trim().valid("onsite", "remotely", "hybrid").required(),
    workingTime: Joi.string().trim().valid("part-time", "full-time").required(),
    seniorityLevel: Joi.string().trim().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
    jobDescription: Joi.string().trim().min(20).required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
    companyId: Joi.string().hex().length(24).required()
});


const updateJobSchema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    jobTitle: Joi.string().trim().min(3),
    jobLocation: Joi.string().trim().valid("onsite", "remotely", "hybrid"),
    workingTime: Joi.string().trim().valid("part-time", "full-time"),
    seniorityLevel: Joi.string().trim().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: Joi.string().trim().min(20),
    technicalSkills: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string())
});


const deleteJobSchema = Joi.object({
    _id: Joi.string().hex().length(24).required()
});


const getJobs_specificcompanySchema = Joi.object({
    companyName: Joi.string().trim().min(3).required()
});


const getFilteredJobsSchema = Joi.object({
    workingTime: Joi.string().trim().valid("part-time", "full-time"),
    jobLocation: Joi.string().trim().valid("onsite", "remotely", "hybrid"),
    seniorityLevel: Joi.string().trim().valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobTitle: Joi.string().trim().min(3),
    technicalSkills: Joi.array().items(Joi.string())
});


const applyJobSchema = Joi.object({
    jobId: Joi.string().hex().length(24).required(),
    userTechSkills: Joi.array().items(Joi.string()).required(),
    userSoftSkills: Joi.array().items(Joi.string()).required(),
    userResume: Joi.object({
        fieldname: Joi.string().trim().required(),
        originalname: Joi.string().trim().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().valid("application/pdf"),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().max(5588880).required()
    }).required()
});


export {
    addJobSchema,
    updateJobSchema,
    deleteJobSchema,
    getJobs_specificcompanySchema,
    getFilteredJobsSchema,
    applyJobSchema
}