import { Router } from "express";
import { getApplications_specificcompany_excel } from "./Application.controller.js";
import { getApplications_specificcompany_excelSchema } from './Application.validationSchema.js';
import { validation } from "../../middleware/validation.js";
import { authentication } from "../../middleware/authentication.js";
import { authorization_CompanyHR } from "../../middleware/authorization.js";


const router = Router();


router.get("/Applications_specificcompany_excel", authentication, authorization_CompanyHR, validation(getApplications_specificcompany_excelSchema), getApplications_specificcompany_excel);


export default router;