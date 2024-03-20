import jwt from 'jsonwebtoken';
import { AppError } from '../utilities/AppError.js';


export const authentication = (req, res, next) => {
    let authorizedToken = req.headers["authorization"];

    if (!authorizedToken || (authorizedToken && !authorizedToken.startsWith("Bearer "))) return next(new AppError("Token is not provided or not authorized!", 401));

    let token = authorizedToken.split(" ")[1];

    jwt.verify(token, process.env.LOGIN_SECRET_KEY, (err, decoded) => {
        if (err) return next(new AppError("Invalid token!", 401));

        req.userId = decoded.userId;

        next();
    });
};