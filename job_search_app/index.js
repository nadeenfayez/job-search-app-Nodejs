import 'dotenv/config';
import express from 'express';
import { connection } from './DB/connection.js';
import applicationRoutes from './src/modules/Application/Application.routes.js';
import companyRoutes from './src/modules/Company/Company.routes.js';
import jobRoutes from './src/modules/Job/Job.routes.js';
import userRoutes from './src/modules/User/User.routes.js';
import { AppError } from './src/utilities/AppError.js';
import { globalErrorHandler } from './src/utilities/globalErrorHandler.js';
import {v2 as cloudinary} from 'cloudinary';


const app = express();
const port = 4200;

app.use(express.json());


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});


connection();


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);


app.use("*", (req, res, next) => { // handle error of invalid routes
    next(new AppError(`Invalid URL ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalErrorHandler);



app.listen(port, () => console.log(`You are listening on port ${port}!`));