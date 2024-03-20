import { UserModel } from '../../DB/models/User.model.js';
import { AppError } from '../utilities/AppError.js';


export async function authorization_CompanyHR (req, res, next) {
    let existedUser = await UserModel.findById(req.userId).select("role -_id");

    if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

    if (existedUser.role === "Company_HR") {
        next();
    }
    else {
        next(new AppError("You are not authorized to do this operation!", 401))
    }
}


export async function authorization_All (req, res, next) {
    let existedUser = await UserModel.findById(req.userId).select("role -_id");

    if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

    if (existedUser.role === "Company_HR" || existedUser.role === "User") {
        next();
    }
    else {
        next(new AppError("You are not authorized to do this operation!", 401))
    }
}


export async function authorization_User (req, res, next) {
    let existedUser = await UserModel.findById(req.userId).select("role -_id");

    if (!existedUser) return next(new AppError("This user doesn't exist!", 404));

    if (existedUser.role === "User") {
        next();
    }
    else {
        next(new AppError("You are not authorized to do this operation!", 401))
    }
}