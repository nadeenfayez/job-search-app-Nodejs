import { ApplicationModel } from '../../../DB/models/Application.model.js';
import { CompanyModel } from '../../../DB/models/Company.model.js';
import { JobModel } from '../../../DB/models/Job.model.js';
import { handleAsyncError } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utilities/AppError.js';
import {v2 as cloudinary} from 'cloudinary';


// Extract job details from the request body
// Convert technicalSkills and softSkills to lowercase
// Insert the new job into the database
// Check if the job was successfully added
// Return success message if job was added
// If job addition failed, return an error
export const addJob = handleAsyncError(async (req, res, next) => {
    let {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId} = req.body;

    let existedCompany = await CompanyModel.findById(companyId);

    if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

    if (existedCompany.companyHR != req.userId) return next(new AppError("You are not the company owner/HR to add a job!", 403));

    technicalSkills = technicalSkills.map( ele => ele.toLowerCase());
    softSkills = softSkills.map( ele => ele.toLowerCase());

    let addedJob = await JobModel.insertMany({jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy: req.userId, companyId});

    if (addedJob.length) {
        res.status(201).json({message: "Job added successfully"});
    }
    else {
        next(new AppError("Something went wrong while adding the job!", 500));
    }
});


// Extract job details from the request body
// Check if the job exists in the database or not based on its unique ID
// If the job doesn't exist, return an error
// Convert technicalSkills and softSkills to lowercase if they exist in the request body
// Update the job in the database if the requester is the creator of the job
// Check if the job was updated successfully
// Return success message if job was updated
// If the requester is not the creator of the job, return an error
export const updateJob = handleAsyncError(async (req, res, next) => {
    let {_id, jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills} = req.body;

    let existedJob = await JobModel.findById(_id);

    if (!existedJob) return next(new AppError("This job doesn't exist!", 404));

    technicalSkills && (technicalSkills = technicalSkills.map( ele => ele.toLowerCase()));
    softSkills && (softSkills = softSkills.map( ele => ele.toLowerCase()));

    let updatedJob = await JobModel.findOneAndUpdate({_id, addedBy: req.userId}, {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills}, {runValidators: true});

    if (updatedJob) {
        res.status(200).json({message: "Job updated successfully"});
    }
    else {
        next(new AppError("You are not the creator of the job!", 403));
    }
});


// Extract the job ID from the request body
// Check if the job exists in the database or not based on its unique ID
// If the job doesn't exist, return an error
// Delete the job from the database if the requester is the creator of the job
// Check if the job was deleted successfully
// Return success message if job was deleted
// If the requester is not the creator of the job, return an error
export const deleteJob = handleAsyncError(async (req, res, next) => {
    let {_id} = req.body;

    let existedJob = await JobModel.findById(_id);

    if (!existedJob) return next(new AppError("This job doesn't exist!", 404));

    let deletedJob = await JobModel.findOneAndDelete({_id, addedBy: req.userId});

    if (deletedJob) {
        res.status(200).json({message: "Job deleted successfully"});
    }
    else {
        next(new AppError("You are not the creator of the job!", 403));
    }
});


// Retrieve all jobs from the database and populate the 'company' field
// Check if any jobs were found
// If no jobs were found, return a 404 error
// If jobs were found, return them as a JSON response with status code 200
export const getJobs_companies = handleAsyncError(async (req, res, next) => {
    let allJobs_companies = await JobModel.find().populate({path: "company", select: "-_id"});

    if (!allJobs_companies) return next(new AppError("There are no jobs available!", 404));

    res.status(200).json(allJobs_companies);
});


// Extract the companyName from the request query
// Check if the company exists in the database or not based on its unique companyName
// If the company doesn't exist, return a 404 error
// Find jobs associated with the specified company
// Check if there are any jobs for the company
// If no jobs are found, return a message indicating so
// If jobs are found, return them as a JSON response with status code 200
export const getJobs_specificcompany = handleAsyncError(async (req, res, next) => {
    let {companyName} = req.query;
    
    let existedCompany = await CompanyModel.findOne({companyName});

    if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

    let jobs = await JobModel.find({companyId: existedCompany._id});

    (!jobs.length) ? res.status(200).json({message: "There are no jobs yet!"}) : res.status(200).json(jobs);
});


// Extract filter parameters from the request body
// Define a filter object based on the provided parameters
// If workingTime, jobLocation, seniorityLevel, jobTitle, or technicalSkills is provided, include it in the filter
// Find jobs in the database that match the specified filters
// Check if any jobs match the filters
// If no matching jobs are found, return a 404 error
// If matching jobs are found, return them as a JSON response with status code 200
export const getFilteredJobs = handleAsyncError(async (req, res, next) => {
    let {workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills} = req.body;

    const filter = {
        ...(workingTime && {workingTime}),
        ...(jobLocation && {jobLocation}),
        ...(seniorityLevel && {seniorityLevel}),
        ...(jobTitle && {jobTitle}),
        ...(technicalSkills && {technicalSkills})
    };
    
    let filteredJobs = await JobModel.find(filter);

    if (!filteredJobs.length) return next(new AppError("There are no jobs match the filters!", 404));

    res.status(200).json(filteredJobs);
});


// Extract necessary data from the request body
// Check if the job exists in the database or not based on its unique ID
// If the job doesn't exist, return a 404 error
// Upload the user resume to cloud storage (Cloudinary in this case)
// Handle any errors that occur during the upload process
// Convert userTechSkills and userSoftSkills to lowercase
// Insert the application into the database
// Check if the application was successfully inserted
// Return a success message if the application was successful
// If the application failed, return a 500 error
export const applyJob = handleAsyncError(async (req, res, next) => {
    let {jobId, userTechSkills, userSoftSkills} = req.body;

    let existedJob = await JobModel.findById(jobId);

    if (!existedJob) return next(new AppError("This job doesn't exist!", 404));

    cloudinary.uploader.upload(req.file.path, async function(error, result) {
        
        if (error) return next(new AppError("Uploading Error!", 500));

        userTechSkills = userTechSkills.map( ele => ele.toLowerCase());
        userSoftSkills = userSoftSkills.map( ele => ele.toLowerCase());
    
        let application = await ApplicationModel.insertMany({jobId, userId: req.userId, userTechSkills, userSoftSkills, userResume: result.secure_url, companyId: existedJob.companyId});
    
        if (application.length) {
            res.status(201).json({message: "You applied to the job successfully"});
        }
        else {
            next(new AppError("Something went wrong while applying to the job!", 500));
        }
    });
});