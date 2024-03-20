import { AppError } from '../utilities/AppError.js';


export function validation (schema) {
    return (req, res, next) => {
        // let inputToValidate;

        // switch (true) {
        //     case !!Object.keys(req.params).length:
        //         inputToValidate = req.params;
        //         break;
        //     case !!Object.keys(req.body).length:
        //         inputToValidate = req.body;
        //         break;
        //     case !!Object.keys(req.query).length:
        //         inputToValidate = req.query;
        //         break;
        //     default:
        //         inputToValidate = req.body;
        // }
        let filters = {};

        if (req.file) {
            filters = {userResume: req.file, ...req.params, ...req.body, ...req.query}
        }
        else {
            filters = {...req.params, ...req.body, ...req.query};
        }

        let {error} = schema.validate(filters, {abortEarly: false});

        if (!error) return next();

        if (error.details.length === 1) return next(new AppError(error.details[0].message, 400));

        let error_messages = [];

        error.details.forEach(err => {
            error_messages.push(err.message);
        });

        next(new AppError(error_messages, 400));
    };
}