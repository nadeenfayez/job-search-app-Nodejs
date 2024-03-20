import Joi from 'joi';


export const getApplications_specificcompany_excelSchema = Joi.object({
    companyName: Joi.string().trim().min(3).required(),
    date: Joi.date().iso().max('now').required()
});