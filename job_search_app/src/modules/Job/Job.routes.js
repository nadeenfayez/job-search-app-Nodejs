import { Router } from 'express';
import { addJob, deleteJob, updateJob, getJobs_companies, applyJob, getJobs_specificcompany, getFilteredJobs } from './Job.controller.js';
import { authorization_CompanyHR, authorization_All, authorization_User } from '../../middleware/authorization.js';
import { authentication } from '../../middleware/authentication.js';
import { validation } from '../../middleware/validation.js';
import { addJobSchema, deleteJobSchema, getFilteredJobsSchema, getJobs_specificcompanySchema, updateJobSchema, applyJobSchema } from './Job.validationSchema.js';
import { uploadSingleFile } from '../../fileUploads.js';


const router = Router();


router.post("/AddJob", authentication, authorization_CompanyHR, validation(addJobSchema), addJob);
router.put("/UpdateJob", authentication, authorization_CompanyHR, validation(updateJobSchema), updateJob);
router.delete("/DeleteJob", authentication, authorization_CompanyHR, validation(deleteJobSchema), deleteJob);
router.get("/Jobs_companies", authentication, authorization_All, getJobs_companies);
router.get("/Jobs_specificcompany", authentication, authorization_All, validation(getJobs_specificcompanySchema), getJobs_specificcompany);
router.post("/FilteredJobs", authentication, authorization_All, validation(getFilteredJobsSchema), getFilteredJobs);
router.post("/ApplyJob", authentication, authorization_User, uploadSingleFile("userResume"), validation(applyJobSchema), applyJob);


export default router;