export const globalErrorHandler = (err, req, res, next) => {
    if (!err.statusCode) {
        process.env.MODE === "DEV" ? res.json({error: err.message, stack: err.stack}) : res.json({error: err.message});
    }
    else{
        process.env.MODE === "DEV" ? res.status(err.statusCode).json({error: err.message, stack: err.stack}) : res.status(err.statusCode).json({error: err.message});
    } 
};