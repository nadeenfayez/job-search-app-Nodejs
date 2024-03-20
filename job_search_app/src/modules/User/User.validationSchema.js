import Joi from 'joi';


const signUpSchema = Joi.object({
    firstName: Joi.string().trim().min(3).max(15).required(),
    lastName: Joi.string().trim().min(3).max(15).required(),
    email: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}).required(),
    password: Joi.string().pattern(/^[A-Za-z]+[0-9]+[!@#%*\.\,\$\^\&]+$/).min(10).required(),
    confirmedPassword: Joi.string().valid(Joi.ref('password')).min(10).required(),
    recoveryEmail: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}).required(),
    DOB: Joi.date().iso().max('now').required(),
    mobileNumber: Joi.string().trim().length(11).required(),
    role: Joi.string().trim().valid("User", "Company_HR").required()
});


const signInSchema = Joi.object({
    email: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}),
    mobileNumber: Joi.string().trim().length(11),
    password: Joi.string().pattern(/^[A-Za-z]+[0-9]+[!@#%*\.\,\$\^\&]+$/).min(10).required()
}).or('email', 'mobileNumber').required();


const updateAccountSchema = Joi.object({
    firstName: Joi.string().trim().min(3).max(15),
    lastName: Joi.string().trim().min(3).max(15),
    email: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}),
    recoveryEmail: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}),
    DOB: Joi.date().iso().max('now'),
    mobileNumber: Joi.string().trim().length(11)
});


const getAnotherUserDataSchema = Joi.object({
    id: Joi.string().hex().length(24),
    _id: Joi.string().hex().length(24)
}).xor('id', '_id').required();


const updatePasswordSchema = Joi.object({
    password: Joi.string().pattern(/^[A-Za-z]+[0-9]+[!@#%*\.\,\$\^\&]+$/).min(10).required(),
    confirmedPassword: Joi.string().valid(Joi.ref('password')).min(10).required()
});


const forgetPasswordSchema = Joi.object({
    email: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}).required(),
    mobileNumber: Joi.string().trim().length(11).required()
});


const resetPasswordSchema = Joi.object({
    email: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}).required(),
    mobileNumber: Joi.string().trim().length(11).required(),
    OTP_user: Joi.string().trim().length(15).required(),
    newPassword: Joi.string().pattern(/^[A-Za-z]+[0-9]+[!@#%*\.\,\$\^\&]+$/).min(10).required(),
    confirmedNewPassword: Joi.string().valid(Joi.ref('newPassword')).min(10).required()
});


const getAccounts_recoverymailSchema = Joi.object({
    recoveryEmail: Joi.string().trim().email({minDomainSegments: 2, tlds: {allow: ['com', 'net', 'eg']}}).required()
});


export {
    signUpSchema,
    signInSchema,
    updateAccountSchema,
    getAnotherUserDataSchema,
    updatePasswordSchema,
    forgetPasswordSchema,
    resetPasswordSchema,
    getAccounts_recoverymailSchema
}