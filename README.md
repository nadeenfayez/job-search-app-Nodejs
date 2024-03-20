# job-search-app-nodejs
This particular Node.js app is to help users search for jobs that are relevant to their domain or area of interest, and it also helps companies in the hiring process.

<h1>Features of Job Search App:</h1>
<ul>
  <li><i>Filter option to get the required job.</i></li>
  <li><i>Handles the user’s data.</i></li>
  <li><i>Handles the company’s data.</i></li>
  <li><i>Handles the job applications.</i></li>
</ul>

<h1>Collections</h1>

<h3>User Collection</h3>
<ol>
  <li>_id</li>
  <li>firstName</li>
  <li>lastName</li>
  <li>username (firstName + lastName)</li>
  <li>email ⇒ (unique)</li>
  <li>password</li>
  <li>recoveryEmail ⇒ (not unique)</li>
  <li>DOB (date of birth, must be date format 2023-12-04)</li>
  <li>mobileNumber ⇒ (unique)</li>
  <li>role ⇒ (User, Company_HR)</li>
  <li>status (online, offline)</li>
  <li>email_isVerified</li>
  <li>recoveryEmail_isVerified</li>
  <li>__v</li>
  <li>createdAt</li> 
  <li>updatedAt</li>
</ol>

<h3>Company Collection</h3>
<ol>
  <li>_id</li>
  <li>companyName ⇒ (unique)</li>
  <li>description (like what are the actual activities and services provided by the company?)</li>
  <li>industry (like Mental Health care)</li>
  <li>address</li>
  <li>numberOfEmployees (must be range such as 11-20 employee)</li>
  <li>companyEmail ⇒ (unique)</li>
  <li>companyHR (userId)</li>
  <li>companyEmail_isVerified</li>
  <li>__v</li>
  <li>createdAt</li> 
  <li>updatedAt</li>
</ol>

<h3>Job Collection</h3>
<ol>
  <li>_id</li>
  <li>jobTitle (like NodeJs back-end developer)</li>
  <li>jobLocation (onsite, remotely, hybrid)</li>
  <li>workingTime (part-time , full-time)</li>
  <li>seniorityLevel (enum of Junior, Mid-Level, Senior, Team-Lead, CTO)</li>
  <li>jobDescription (identify what the job is and what he/she will do if accepted)</li>
  <li>technicalSkills (array of skills, like nodejs, typescript, ...)</li>
  <li>softSkills (array of skills, like time management, team worker, ...)</li>
  <li>addedBy (what is the companyHrId who is added this job)</li>
  <li>companyId</li>
  <li>__v</li>
  <li>createdAt</li> 
  <li>updatedAt</li>
</ol>

<h3>Application Collection</h3>
<ol>
  <li>_id</li>
  <li>jobId (the Job Id)</li>
  <li>userId (the applier Id)</li>
  <li>userTechSkills (array of the applier technical skills)</li>
  <li>userSoftSkills (array of the applier soft skills)</li>
  <li>userResume (must be pdf, upload this pdf on cloudinary)</li>
  <li>companyId</li>
  <li>__v</li>
  <li>createdAt</li> 
  <li>updatedAt</li>
</ol>


<h1>User APIs</h1>
<ol>
  <li><b>Sign up</b></li>
  <li><b>Sign in</b></li>
    <ul>
      <li>Sign in using (email or mobileNumber) and password</li>
      <li>Update the status to online after signing in</li>
    </ul>
  <li><b>Verify email</b></li>
  <li><b>Verify recovery email</b></li>
  <li><b>Update account</b></li>
    <ul>
      <li>You can update (email, mobileNumber, recoveryEmail, DOB, lastName, firstName)</li>
      <li>If user update the email or mobileNumber, the new data doesn’t conflict with any existing data in the database</li>
      <li>User must be logged in</li>
      <li>Only the owner of the account can update his/her account data</li>
    </ul>
  <li><b>Delete account</b></li>
    <ul>
      <li>Only the owner of the account can delete his/her account data</li>
      <li>User must be logged in</li>
    </ul>
  <li><b>Get user account data</b></li>
    <ul>
      <li>Only the owner of the account can delete his/her account data</li>
      <li>User must be logged in</li>
    </ul>
  <li><b>Get profile data for another user</b></li>
    <ul>
      <li><b>Send the userId in params or query</b></li>
    </ul>
  <li><b>Update password</b></li>
  <li><b>Reset password</b></li>
  <li><b>Forget password</b> (without sending any email, making sure of data security specially the OTP and the newPassword)</li>
  <li><b>Get all accounts associated to a specific recovery email</b></li>
</ol>

<h1>Company APIs</h1>
<ol>
  <li><b>Add company</b></li>
    <ul>
      <li>Authorization with role (Company_HR)</li>
    </ul>
  <li><b>Verify company email</b></li>
  <li><b>Update company data</b></li>
    <ul>
      <li>Only the company owner can update the data</li>
      <li>Authorization with role (Company_HR)</li>
    </ul>
  <li><b>Delete company data</b></li>
    <ul>
      <li>Only the company owner can delete the data</li>
      <li>Authorization with role (Company_HR)</li>
    </ul>
  <li><b>Get company data</b></li>
    <ul>
      <li>Send the companyId in params to get the desired company data</li>
      <li>Return all jobs related to this company</li>
      <li>Authorization with role (Company_HR)</li>
    </ul>
  <li><b>Search for a company with a name</b></li>
    <ul>
      <li>Authorization with the role (Company_HR and User)</li>
    </ul>
  <li><b>Get all applications for specific jobs</b></li>
    <ul>
      <li>Each company owner can only take a look at the applications for his job; he has no access to other companies’ applications</li>
      <li>Return each application with the user data, not the userId</li>
      <li>Authorization with role (Company_HR)</li>
    </ul>
</ol>

<h1>Job APIs</h1>
<ol>
  <li><b>Add job</b></li>
    <ul>
      <li>Authorization with the role (Company_HR)</li>
    </ul>
  <li><b>Update job</b></li>
    <ul>
      <li>Authorization with the role (Company_HR)</li>
    </ul>
  <li><b>Delete job</b></li>
    <ul>
      <li>Authorization with the role (Company_HR)</li>
    </ul>
  <li><b>Get all jobs with their company’s information</b></li>
    <ul>
      <li>Authorization with the role (User, Company_HR)</li>
    </ul>
  <li><b>Get all jobs for a specific company</b></li>
    <ul>
      <li>Authorization with the role (User, Company_HR)</li>
      <li>Send the company name in the query and get this company jobs</li>
    </ul>
  <li><b>Get all jobs that match the following filters</b></li>
    <ul>
      <li>Allow user to filter with workingTime, jobLocation, seniorityLevel, jobTitle, and technicalSkills</li>
      <dl>
        <li>One or more of them should applied</li>
        <dd><b><i>Example:</i></b> If the user selects the <b>workingTime</b> is <b>part-time</b> and the <b>jobLocation</b> is <b>onsite</b>, we return all jobs that match these conditions</dd>
      </dl>
      <li>Authorization with the role (User, Company_HR)</li>
    </ul>
  <li><b>Apply to job</b></li>
    <ul>
      <li>This API will add a new document in the application collection with the new data</li>
      <li>Authorization with the role (User)</li>
    </ul>
</ol>

<h1>Application APIs</h1>
<ol>
  <li><b>Collect applications</b></li>
    <ul>
      <li>An endpoint that collects the applications for a specific company on a specific day and create an Excel sheet with this data</li>
      <li>Authorization with role (Company_HR)</li>
    </ul>
</ol>


<h1>Implemented</h1>

<ol>
  <li>Validation for each API requires data (joi)</li>
  <li>Authentication and authorization</li>
  <li>Handling asynchronous errors for each API</li>
  <li>Handling invalid routes errors</li>
  <li>Global error handling</li>
  <li>JSON Web Token (JWT)</li>
  <li>The .env file</li>
  <li>Model-View-Controller (MVC)</li>
  <li>Cashing</li>
  <li>Hashing (bcrypt)</li>
  <li>Uploading files (multer, Cloudinary)</li>
  <li>Single-Responsibility Principle (SOLID)</li>
  <li>Unit testing</li>
</ol>
