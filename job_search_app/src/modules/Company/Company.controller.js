import { CompanyModel } from '../../../DB/models/Company.model.js';
import { handleAsyncError } from '../../middleware/handleAsyncError.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utilities/AppError.js';
import { sendCompanyEmail } from '../../service/sendEmail.js';
import { JobModel } from '../../../DB/models/Job.model.js';
import { ApplicationModel } from '../../../DB/models/Application.model.js';


// Extract company details from the request body
// Check if a company with the provided company email already exists
// If a company with the provided email exists, return a 409 conflict error
// Insert the new company into the database
// Check if the company was successfully added
// Generate a verification token for the company email
// Send an email to verify the company email
// Return a success message with status code 201
// If adding the company failed, return a 500 error
export const addCompany = handleAsyncError(async (req, res, next) => {
    let {companyName, description, industry, address, numberOfEmployees, companyEmail} = req.body;

    let existedCompany = await CompanyModel.findOne({companyEmail});

    if (existedCompany) return next(new AppError("This company already exists!", 409));

    let addedCompany = await CompanyModel.insertMany({companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR: req.userId});

    if (addedCompany.length) {
        let token = jwt.sign({companyId: addedCompany[0]._id}, process.env.VERIFY_COMPANY_EMAIL_SECRET_KEY);

        sendCompanyEmail({companyEmail, companyName, api: `http://localhost:4200/api/v1/Company/VerifyCompanyEmail/${token}`});

        res.status(201).json({message: "Company added successfully"});
    }
    else {
        next(new AppError("Something went wrong while adding the company!", 500));
    }
});


// Extract the verification token from the request parameters
// Verify the token using the secret key
// Handle any errors that occur during token verification
// Check if the company exists in the database or not based on the decoded unique company ID
// If the company doesn't exist, return a 404 error
// Update the company's email verification status to true
// If updating the company fails, return a 500 error
// Return a success message with status code 200
export const verifyCompanyEmail = handleAsyncError((req, res, next) => {
    let {token} = req.params;

    return jwt.verify(token, process.env.VERIFY_COMPANY_EMAIL_SECRET_KEY, async (err, decoded) => {
        if (err) return next(new AppError("Invalid token!", 401));

        let existedCompany = await CompanyModel.findById(decoded.companyId);

        if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

        let verifiedCompany = await CompanyModel.findByIdAndUpdate(decoded.companyId, {companyEmail_isVerified: true});

        if (!verifiedCompany) return next(new AppError("Something went wrong while verifying!", 500));

        res.status(200).json({message: "Verified :)"});
    });
});


// Extract company details from the request body
// Check if the company exists in the database or not based on its unique ID
// If the company doesn't exist, return a 404 error
// Update the company's data if the requester is the owner of the company
// Check if the company's data was successfully updated
// Find the updated company data from the database
// Check if the company email was changed
// If the company email was changed, update the email verification status to false
// Generate a verification token for the new company email
// Send an email to verify the new company email
// Return a success message with status code 200
// If the requester is not the owner of the company, return a 403 error
export const updateCompany = handleAsyncError(async (req, res, next) => {
    let {_id, companyName, description, industry, address, numberOfEmployees, companyEmail} = req.body;

    let existedCompany = await CompanyModel.findById(_id);

    if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

    let updatedCompany_old = await CompanyModel.findOneAndUpdate({_id, companyHR: req.userId}, {companyName, description, industry, address, numberOfEmployees, companyEmail}, {runValidators: true});

    if (updatedCompany_old) {
        let updatedCompany_new = await CompanyModel.findById(_id);

        if (updatedCompany_old.companyEmail !== updatedCompany_new.companyEmail) {           
            await CompanyModel.findByIdAndUpdate(_id, {companyEmail_isVerified: false});

            let token = jwt.sign({companyId: _id}, process.env.VERIFY_COMPANY_EMAIL_SECRET_KEY);

            sendCompanyEmail({companyEmail: updatedCompany_new.companyEmail, companyName, api: `http://localhost:4200/api/v1/Company/VerifyCompanyEmail/${token}`});
        }

        res.status(200).json({message: "Company data updated successfully"});
    }
    else {
        next(new AppError("You are not the owner of the company!", 403));
    }
});


// Extract the company ID from the request body
// Check if the company exists in the database or not based on its unique ID
// If the company doesn't exist, return a 404 error
// Delete the company's data if the requester is the owner of the company
// Check if the company's data was successfully deleted
// Return a success message with status code 200
// If the requester is not the owner of the company, return a 403 error
export const deleteCompany = handleAsyncError(async (req, res, next) => {
    let {_id} = req.body;

    let existedCompany = await CompanyModel.findById(_id);

    if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

    let deletedCompany = await CompanyModel.findOneAndDelete({_id, companyHR: req.userId});

    if (deletedCompany) {
        res.status(200).json({message: "Company data deleted successfully"});
    }
    else {
        next(new AppError("You are not the owner of the company!", 403));
    }
});


// Extract the companyId from the request parameters
// Check if the company exists in the database or not based on its unique ID
// If the company doesn't exist, return a 404 error
// Check if the requester is the owner of the company
// If the requester is not the owner of the company, return a 403 error
// Find related jobs associated with the company
// Return company data along with related jobs as a JSON response with status code 200
export const getCompanyData = handleAsyncError(async (req, res, next) => {
    let {companyId} = req.params;

    let existedCompany = await CompanyModel.findById(companyId);

    if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

    let relatedJobs = await JobModel.find({companyId});

    res.status(200).json({Company: existedCompany, Jobs: relatedJobs});
});


// Extract the 'name' parameter from the request body
// Check if the 'name' parameter is missing or empty
// Search for companies in the database whose companyName matches the provided name (case-insensitive) (search by part of name or the fullname of company) (search flexibility)
// If no companies are found, return a 404 error
// If companies are found, return them as a JSON response with status code 200
export const searchCompany_name = handleAsyncError(async (req, res, next) => {
    let {name} = req.body;

    let companyData = await CompanyModel.find({companyName: new RegExp(name, "i")});

    if (!companyData.length) return next(new AppError("No company exists with this name!", 404));

    res.status(200).json(companyData);
});


// Extract the jobId from the request body
// Check if the job exists in the database or not based on its unique ID
// If the job doesn't exist, return a 404 error
// Check if the requester is the owner of the company associated with the job
// If the requester is not the company owner, return a 403 error
// Check if the requester is the creator of the job
// Find applications for the job and populate user details
// If no applications are found, return a message indicating so
// If applications are found, return them as a JSON response with status code 200
// If the requester is not the creator of the job, return a 403 error
export const getApplications_specificjobs = handleAsyncError(async (req, res, next) => {
    let {jobId} = req.body;

    let existedJob = await JobModel.findById(jobId);

    if (!existedJob) return next(new AppError("This job doesn't exist!", 404));

    let isCompanyOwner = await CompanyModel.findOne({_id: existedJob.companyId, companyHR: req.userId});

    if (!isCompanyOwner) return next(new AppError("You are not the company owner!", 403));
    
    if (existedJob.addedBy == req.userId) {
        let applications = await ApplicationModel.find({jobId}).populate({path: "user_data", select: "-_id"});

        (!applications.length) ? res.status(200).json({message: "No one has applied to this job yet"}) : res.status(200).json(applications);
    }
    else {
        next(new AppError("You are not the creator of this job!", 403));
    }
});