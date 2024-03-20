import { UserModel } from '../../../DB/models/User.model.js';
import { handleAsyncError } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utilities/AppError.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../service/sendEmail.js';
import otpGenerator from 'otp-generator';
import { myCache } from '../../utilities/cache.js';


// Extract user details from the request body
// Check if the provided password matches the confirmed password
// Check if a user with the provided email already exists
// If a user with the email exists, return a 409 conflict error
// Concatenate first name and last name to create a username
// Hash the password using bcrypt
// Insert the new user into the database
// Check if the user was successfully added
// Generate a verification token for the user email
// Send verification emails to the user email and recovery email
// Return a success message with status code 201
// If adding the user fails, return a 500 error
export const signUp = handleAsyncError(async (req, res, next) => {
    let {firstName, lastName, email, password, confirmedPassword, recoveryEmail, DOB, mobileNumber, role} = req.body;

    if (password != confirmedPassword) return next(new AppError("Passwords don't match!", 400));

    let existedUser = await UserModel.findOne({email});

    if (existedUser) return next(new AppError("This user already exists!", 409));

    let fullName = firstName + " " + lastName;

    let hashedPassword = bcrypt.hashSync(String(password), Number(process.env.SALT_ROUNDS));

    let addedUser = await UserModel.insertMany({firstName, lastName, username: fullName.replace(/\s/g, ""), email, password: hashedPassword, recoveryEmail, DOB, mobileNumber, role});

    if (addedUser.length) {
        let token = jwt.sign({userId: addedUser[0]._id}, process.env.VERIFY_USER_EMAIL_SECRET_KEY);
        let token2 = jwt.sign({userId: addedUser[0]._id}, process.env.VERIFY_USER_RECOVERY_EMAIL_SECRET_KEY);

        sendEmail({email, firstName, fullName, api: `http://localhost:4200/api/v1/user/VerifyEmail/${token}`});
        sendEmail({recoveryEmail, firstName, fullName, api: `http://localhost:4200/api/v1/user/VerifyRecoveryEmail/${token2}`});

        res.status(201).json({message: "User added successfully"});
    }
    else {
        next(new AppError("Something went wrong while adding the user!", 500));
    }
});


// Extract the verification token from the request parameters
// Verify the token using the secret key
// Handle any errors that occur during token verification
// Check if the user exists in the database or not based on the decoded unique user ID
// If the user doesn't exist, return a 404 error
// Update the user's email verification status to true
// If updating the user fails, return a 500 error
// Return a success message with status code 200
export const verifyEmail = handleAsyncError((req, res, next) => {
    let {token} = req.params;

    return jwt.verify(token, process.env.VERIFY_USER_EMAIL_SECRET_KEY, async (err, decoded) => {
        if (err) return next(new AppError("Invalid token!", 401));

        let existedUser = await UserModel.findById(decoded.userId);

        if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

        let verifiedUser = await UserModel.findByIdAndUpdate(decoded.userId, {email_isVerified: true});

        if (!verifiedUser) return next(new AppError("Something went wrong while verifying!", 500));

        res.status(200).json({message: "Verified :)"});
    });
});


// Extract the verification token from the request parameters
// Verify the token using the secret key
// Handle any errors that occur during token verification
// Check if the user exists in the database or not based on the decoded unique user ID
// If the user doesn't exist, return a 404 error
// Update the user's recovery email verification status to true
// If updating the user fails, return a 500 error
// Return a success message with status code 200
export const verifyRecoveryEmail = handleAsyncError((req, res, next) => {
    let {token} = req.params;

    return jwt.verify(token, process.env.VERIFY_USER_RECOVERY_EMAIL_SECRET_KEY, async (err, decoded) => {
        if (err) return next(new AppError("Invalid token!", 401));

        let existedUser = await UserModel.findById(decoded.userId);

        if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

        let verifiedUser = await UserModel.findByIdAndUpdate(decoded.userId, {recoveryEmail_isVerified: true});

        if (!verifiedUser) return next(new AppError("Something went wrong while verifying!", 500));

        res.status(200).json({message: "Verified :)"});
    });
});


// Extract email, mobileNumber, and password from the request body
// Check if the user exists in the database or not based on unique email or unique mobileNumber
// If the user exists
// Check if the user's email is verified
// Check if the user's recovery email is verified
// Compare the provided password with the stored hashed password
// If passwords don't match, return a 401 error
// Update the user's status to "online"
// If updating the user fails, return a 500 error
// Generate a JSON Web Token (JWT) for user authentication
// Return a success message along with the token
// If the user doesn't exist, return a 404 error
export const signIn = handleAsyncError(async (req, res, next) => {
    let {email, mobileNumber, password} = req.body;

    let existedUser = await UserModel.findOne({$or: [{email}, {mobileNumber}]});

    if (existedUser) {
        if (!existedUser.email_isVerified) return next(new AppError("Please verify your email first!", 403));

        if (!existedUser.recoveryEmail_isVerified) return next(new AppError("Please verify your recovery email first!", 403));

        let matchedPassword = bcrypt.compareSync(String(password), existedUser.password);
        
        if (!matchedPassword) return next(new AppError("Wrong password!", 401));

        let activatedUser = await UserModel.findByIdAndUpdate(existedUser._id, {status: "online"}, {runValidators: true});
        
        if (!activatedUser) return next(new AppError("Something went wrong while siging in. Please sign in again!", 500));

        let token = jwt.sign({userId: existedUser._id, name: existedUser.name}, process.env.LOGIN_SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({message: `Welcome ${existedUser.firstName} ${existedUser.lastName}, happy to see you again :)`, token});
    }
    else {
        next(new AppError("This user doesn't exist!", 404));
    }
});


// Extract user account information from the request body
// Check if the user's account exists in the database or not based on their user ID
// If the user's account doesn't exist, return a 404 error
// Initialize a variable to hold the user's full name
// Determine the full name based on provided first name and last name
// Update the user's account information in the database
// If updating the account is successful
// Retrieve the updated account information
// If the user's email has changed
// Mark the email as not verified
// Generate a verification token for the email update
// Send an email verification link to the updated email address
// If the user's recovery email has changed
// Mark the recovery email as not verified
// Generate a verification token for the recovery email update
// Send an email verification link to the updated recovery email address
// Return a success message with status code 200
// If updating the account fails, return a 500 error
export const updateAccount = handleAsyncError(async (req, res, next) => {
    let {firstName, lastName, email, recoveryEmail, DOB, mobileNumber} = req.body;

    let existedAccount = await UserModel.findById(req.userId);

    if (!existedAccount) return next(new AppError("This account doesn't exist!", 404));

    let fullName;

    switch (true) {
        case !!(!firstName && lastName):
            fullName = existedAccount.firstName + " " + lastName;
            break;
        case !!(firstName && !lastName):
            fullName = firstName + " " + existedAccount.lastName;
            break;
        case !!(!firstName && !lastName):
            fullName = existedAccount.firstName + " " + existedAccount.lastName;
            break;
        default:
            fullName = firstName + " " + lastName;
    }

    let updatedAccount_old = await UserModel.findByIdAndUpdate(req.userId, {firstName, lastName, username: fullName.replace(/\s/g, ""), email, recoveryEmail, DOB, mobileNumber}, {runValidators: true});

    if (updatedAccount_old) {
        let updatedAccount_new = await UserModel.findById(req.userId);

        if (updatedAccount_old.email !== updatedAccount_new.email) {           
            await UserModel.findByIdAndUpdate(req.userId, {email_isVerified: false});

            let token = jwt.sign({userId: req.userId}, process.env.VERIFY_USER_EMAIL_SECRET_KEY);

            sendEmail({email: updatedAccount_new.email, firstName, fullName, api: `http://localhost:4200/api/v1/User/VerifyEmail/${token}`});
        }

        if (updatedAccount_old.recoveryEmail !== updatedAccount_new.recoveryEmail) {           
            await UserModel.findByIdAndUpdate(req.userId, {recoveryEmail_isVerified: false});

            let token = jwt.sign({userId: req.userId}, process.env.VERIFY_USER_RECOVERY_EMAIL_SECRET_KEY);

            sendEmail({email: updatedAccount_new.recoveryEmail, firstName, fullName, api: `http://localhost:4200/api/v1/User/VerifyRecoveryEmail/${token}`});
        }

        res.status(200).json({message: "Account updated successfully"});
    }
    else {
        next(new AppError("Something went wrong while updating the account!", 500));
    }
});


// Check if the user's account exists in the database or not based on their unique user ID
// If the user's account doesn't exist, return a 404 error
// Delete the user's account from the database
// If deleting the account is successful
// Return a success message with status code 200
// If deleting the account fails, return a 500 error
export const deleteAccount = handleAsyncError(async (req, res, next) => {
    let existedAccount = await UserModel.findById(req.userId);

    if (!existedAccount) return next(new AppError("This account doesn't exist!", 404));

    let deletedAccount = await UserModel.findByIdAndDelete(req.userId);

    if (deletedAccount) {
        res.status(200).json({message: "Account deleted successfully"});
    }
    else {
        next(new AppError("Something went wrong while deleting the account!", 403));
    }
});


// Retrieve user data from the database based on the user ID in the request
// If user data does not exist, return a 404 error
// Return user data with status code 200
export const getUserData = handleAsyncError(async (req, res, next) => {
    let userData = await UserModel.findById(req.userId);

    if (!userData) return next(new AppError("This user doesn't exist!", 404));

    res.status(200).json(userData);
});


// Extract the user ID from the request parameters or the query parameters
// Find user data based on either the user ID from the request parameters or the query parameters
// If user data does not exist, return a 404 error
// Return user data with sensitive fields excluded and status code 200
export const getAnotherUserData = handleAsyncError(async (req, res, next) => {
    let {id} = req.params;
    let {_id} = req.query;

    let anotherUserData = await UserModel.findById(id || _id).select("-_id -password -recoveryEmail -email_isVerified -recoveryEmail_isVerified -__v -createdAt -updatedAt");

    if (!anotherUserData) return next(new AppError("This user doesn't exist!", 404));

    res.status(200).json(anotherUserData);
});


// Extract password and confirmed password from the request body
// Check if the passwords match
// Check if the user's account exists in the database or not based on their unique user ID
// If the user's account doesn't exist, return a 404 error
// Hash the updated password
// Update the user's password in the database
// If updating the password is successful, return a success message with status code 200
// If updating the password fails, return a 500 error
export const updatePassword = handleAsyncError(async (req, res, next) => {
    let {password, confirmedPassword} = req.body;

    if (password != confirmedPassword) return next(new AppError("Passwords don't match!", 400));

    let existedAccount = await UserModel.findById(req.userId);

    if (!existedAccount) return next(new AppError("This account doesn't exist!", 404));

    let updatedHashedPassword = bcrypt.hashSync(String(password), Number(process.env.UPDATE_PASS_SALT_ROUNDS));

    let updatedPassword = await UserModel.findByIdAndUpdate(req.userId, {password: updatedHashedPassword}, {runValidators: true});

    if (updatedPassword) {
        res.status(200).json({message: "Password updated successfully"});
    }
    else {
        next(new AppError("Something went wrong while updating the password!", 500));
    }
});


// Extract email and mobile number from the request body
// Find the user in the database based on the provided email and mobile number
// If the user doesn't exist, return a 404 error
// Check if the user's email is verified
// Generate a random OTP (One-Time Password)
// Store the OTP in cache with a short expiration time (1 minute)
// If storing the OTP in cache is successful
// Return a success message along with the OTP to the user
// If storing the OTP in cache fails, return a 500 error
export const forgetPassword = handleAsyncError(async (req, res, next) => {
    let {email, mobileNumber} = req.body;

    let existedUser = await UserModel.findOne({email, mobileNumber});

    if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

    if (!existedUser.email_isVerified) return next(new AppError("Please verify your email first!", 403));

    let OTP = otpGenerator.generate(15);

    let success = myCache.set("OTP", OTP, 60);

    success && res.status(200).json({message: "Use this OTP for reset your password, don't share OTP with anyone for your safety!", OTP}) || next(new AppError("Something went wrong while generating the OTP!", 500));;
});


// Extract email, mobile number, OTP entered by the user, new password, and confirmed new password from the request body
// Check if the new password matches the confirmed new password
// Find the user in the database based on the provided email and mobile number
// If the user doesn't exist, return a 404 error
// Check if the user's email is verified
// Retrieve the original OTP from the cache and then delete it from the cache
// Check if the OTP entered by the user matches the original OTP
// Hash the new password
// Reset the user's password in the database
// If the password reset is successful
// Return a success message
// If something goes wrong during password reset, return a 500 error
export const resetPassword = handleAsyncError(async (req, res, next) => {
    let {email, mobileNumber, OTP_user, newPassword, confirmedNewPassword} = req.body;

    if (newPassword != confirmedNewPassword) return next(new AppError("Passwords don't match!", 400));

    let existedUser = await UserModel.findOne({email, mobileNumber});

    if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

    if (!existedUser.email_isVerified) return next(new AppError("Please verify your email first!", 403));

    let OTP_original = myCache.take("OTP");

    if (OTP_user !== OTP_original) return next(new AppError("Wrong OTP!", 401));

    let hashedNewPassword = bcrypt.hashSync(String(newPassword), Number(process.env.NEW_PASS_SALT_ROUNDS));

    let resetPassword = await UserModel.findOneAndUpdate({email}, {password: hashedNewPassword}, {runValidators: true});

    if (resetPassword) {
        res.status(200).json({message: "Password reset successfully"});
    }
    else {
        next(new AppError("Something went wrong while reseting the password!", 500));
    }
});


// Extract the recovery email from the request body
// Find user accounts in the database based on the provided recovery email
// If no accounts are found, return a 404 error
// Return the found accounts as a JSON response
export const getAccounts_recoverymail = handleAsyncError(async (req, res, next) => {
    let {recoveryEmail} = req.body;

    let accounts = await UserModel.find({recoveryEmail});

    if (!accounts.length) return next(new AppError("This recovery email isn't associated to any account!", 404));

    res.status(200).json(accounts);
});