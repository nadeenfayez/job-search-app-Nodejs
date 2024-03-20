import Joi from 'joi';


const addCompanySchema = Joi.object({
    companyName: Joi.string().trim().min(3).required(),
    description: Joi.string().trim().min(20).required(),
    industry: Joi.string().trim().min(5).required(),
    address: Joi.string().trim().min(10).required(),
    numberOfEmployees: Joi.number().min(11).max(20).required(),
    companyEmail: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}).required()
});


const updateCompanySchema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    companyName: Joi.string().trim().min(3),
    description: Joi.string().trim().min(20),
    industry: Joi.string().trim().min(5),
    address: Joi.string().trim().min(10),
    numberOfEmployees: Joi.number().min(11).max(20),
    companyEmail: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}})
});


const deleteCompanySchema = Joi.object({
    _id: Joi.string().hex().length(24).required()
});


const getCompanyDataSchema = Joi.object({
    companyId: Joi.string().hex().length(24).required()
});


const searchCompany_nameSchema = Joi.object({
    name: Joi.string().trim().min(1).required()
});


const getApplications_specificjobsSchema = Joi.object({
    jobId: Joi.string().hex().length(24).required()
});


export {
    addCompanySchema,
    updateCompanySchema,
    deleteCompanySchema,
    getCompanyDataSchema,
    searchCompany_nameSchema,
    getApplications_specificjobsSchema
}