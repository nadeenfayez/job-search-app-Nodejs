import exceljs from 'exceljs';
import { CompanyModel } from '../../../DB/models/Company.model.js';
import { ApplicationModel } from '../../../DB/models/Application.model.js';
import { handleAsyncError } from '../../middleware/handleAsyncError.js';
import { AppError } from '../../utilities/AppError.js';


// Extract query parameters from request
// Check if the company exists in the database or not based on its unique companyName
// If the company does not exist, return an error response
// Define start and end of the day of the requested date and set the time to the beginning and end of the day respectively
// Find applications for the specific company and within the given day
// If no applications are found, return a message indicating so
// Create a new Excel workbook
// Add a worksheet with the company name and customize its properties
// Define column headers and widths for the worksheet
// Add rows to the worksheet with applications data
// Set response headers for Excel file download
// Write the workbook to the response stream
// End the response stream
export const getApplications_specificcompany_excel = handleAsyncError(async (req, res, next) => {
    let {companyName, date} = req.query;

    let existedCompany = await CompanyModel.findOne({companyName});

    if (!existedCompany) return next(new AppError("This company doesn't exist!", 404));

    if (existedCompany.companyHR != req.userId) return next(new AppError("You are not the company owner!", 403));

    let startOfDay = new Date(date);
    let endOfDay = new Date(date);

    startOfDay.setUTCHours(0, 0, 0, 0);
    endOfDay.setUTCHours(23, 59, 59, 999);    

    let applications = await ApplicationModel.find({companyId: existedCompany._id, createdAt: {$gte: startOfDay, $lte: endOfDay}});

    if (!applications.length) return res.status(200).json({message: "No one has applied to any job on this day"});

    const workbook = new exceljs.Workbook();

    const sheet = workbook.addWorksheet(`${companyName} Applications`, {properties:{tabColor:{argb:'FF00CED1'}}, views:[{state: 'frozen', xSplit: 0, ySplit: 1}]});

    sheet.columns = [
        {header: '_id', key: '_id', width: 27},
        {header: 'jobId', key: 'jobId', width: 27},
        {header: 'userId', key: 'userId', width: 27},
        {header: 'userTechSkills', key: 'userTechSkills', width: 27},
        {header: 'userSoftSkills', key: 'userSoftSkills', width: 27},
        {header: 'userResume', key: 'userResume', width: 27},
        {header: 'companyId', key: 'companyId', width: 27},
        {header: '__v', key: '__v'},
        {header: 'createdAt', key: 'createdAt', width: 27},
        {header: 'updatedAt', key: 'updatedAt', width: 27}
    ];

    applications.forEach(application => {
        sheet.addRow({
            _id: application._id, // We use the key to add not the header
            jobId: application.jobId,
            userId: application.userId,
            userTechSkills: application.userTechSkills,
            userSoftSkills: application.userSoftSkills,
            userResume:application.userResume,
            companyId: application.companyId,
            __v: application.__v,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename = ${companyName}_Applications.xlsx`);

    await workbook.xlsx.write(res);

    res.end();
});