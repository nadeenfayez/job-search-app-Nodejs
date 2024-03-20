import { Router } from 'express';
import { signUp, verifyEmail, verifyRecoveryEmail, signIn, updateAccount, deleteAccount, getUserData, getAnotherUserData, updatePassword, forgetPassword, resetPassword, getAccounts_recoverymail } from './User.controller.js';
import { authentication } from '../../middleware/authentication.js';
import { authorization_CompanyHR, authorization_All } from '../../middleware/authorization.js';
import { validation } from '../../middleware/validation.js';
import { forgetPasswordSchema, getAccounts_recoverymailSchema, getAnotherUserDataSchema, resetPasswordSchema, signInSchema, signUpSchema, updateAccountSchema, updatePasswordSchema } from './User.validationSchema.js';


const router = Router();


router.post("/SignUp", validation(signUpSchema), signUp);
router.post("/SignIn", validation(signInSchema), signIn);
router.put("/UpdateAccount", authentication, authorization_All, validation(updateAccountSchema), updateAccount);
router.delete("/DeleteAccount", authentication, authorization_All, deleteAccount);
router.get("/UserData", authentication, authorization_All, getUserData);
router.get("/AnotherUserData/:id?", authentication, authorization_All, validation(getAnotherUserDataSchema), getAnotherUserData);
router.patch("/UpdatePassword", authentication, authorization_All, validation(updatePasswordSchema), updatePassword);
router.post("/ForgetPassword", validation(forgetPasswordSchema), forgetPassword);
router.patch("/ResetPassword", validation(resetPasswordSchema), resetPassword);
router.post("/Accounts_recoverymail", authentication, authorization_CompanyHR, validation(getAccounts_recoverymailSchema), getAccounts_recoverymail);
router.get("/VerifyEmail/:token", verifyEmail);
router.get("/VerifyRecoveryEmail/:token", verifyRecoveryEmail);


export default router;