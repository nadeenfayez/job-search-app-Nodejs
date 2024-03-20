import { Router } from 'express';
import { addCompany, deleteCompany, updateCompany, verifyCompanyEmail, getCompanyData, searchCompany_name, getApplications_specificjobs } from './Company.controller.js';
import { authentication } from '../../middleware/authentication.js';
import { authorization_CompanyHR, authorization_All } from '../../middleware/authorization.js';
import { validation } from '../../middleware/validation.js';
import { addCompanySchema, updateCompanySchema, deleteCompanySchema, getCompanyDataSchema, searchCompany_nameSchema, getApplications_specificjobsSchema } from './Company.validationSchema.js';


const router = Router();


router.post("/AddCompany", authentication, authorization_CompanyHR, validation(addCompanySchema), addCompany);
router.get("/VerifyCompanyEmail/:token", verifyCompanyEmail);
router.put("/UpdateCompany", authentication, authorization_CompanyHR, validation(updateCompanySchema), updateCompany);
router.delete("/DeleteCompany", authentication, authorization_CompanyHR, validation(deleteCompanySchema), deleteCompany);
router.get("/CompanyData/:companyId", authentication, authorization_CompanyHR, validation(getCompanyDataSchema), getCompanyData);
router.post("/CompanySearch_name", authentication, authorization_All, validation(searchCompany_nameSchema), searchCompany_name);
router.post("/Applications_specificjobs", authentication, authorization_CompanyHR, validation(getApplications_specificjobsSchema), getApplications_specificjobs);


export default router;