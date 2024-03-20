# job-search-app-nodejs
This particular app describes searching for a job that is relevant to their domain or area of interest.

<h1>Features of Job Search App:</h1>
<ul>
  <li><i>Filter option to get the required job.</i></li>
  <li><i>Handles the user’s data.</i></li>
  <li><i>Handles the company’s data.</i></li>
  <li><i>Handles the Job Applications.</i></li>
</ul>

<h1>Collections</h1>
<h3 style = "color: blue; text-decoration: underline;">User Collection</h3>
<ol>
  <li>firstName</li>
  <li>lastName</li>
  <li>username (firstName + lastName)</li>
  <li>email ⇒ (unique)</li>
  <li>password</li>
  <li>recoveryEmail ⇒ (not unique)</li>
  <li>DOB (date of birth, must be date format 2023-12-4)</li>
  <li>mobileNumber ⇒ (unique)</li>
  <li>role ⇒ (User, Company_HR)</li>
  <li>status (online, offline)</li>
</ol>

<h3 style = "color: blue; text-decoration: underline;">Company Collection</h3>
<ol>
  <li>companyName ⇒ (unique)</li>
  <li>description (Like what are the actual activities and services provided by the company?)</li>
  <li>industry (Like Mental Health care)</li>
  <li>address</li>
  <li>numberOfEmployees (must be range such as 11-20 employee)</li>
  <li>companyEmail ⇒ (unique)</li>
  <li>companyHR (userId)</li>
</ol>

<h3 style = "color: blue; text-decoration: underline;">Job Collection</h3>
<ol>
  <li>jobTitle (Like NodeJs back-end developer)</li>
  <li>jobLocation (onsite, remotely, hybrid)</li>
  <li>workingTime (part-time , full-time)</li>
  <li>seniorityLevel (enum of Junior, Mid-Level, Senior, Team-Lead, CTO)</li>
  <li>jobDescription (identify what is the job and what i will do if i accepted)</li>
  <li>technicalSkills (array of skills, like nodejs, typescript , ...)</li>
  <li>softSkills (array of skills, like time management, team worker, ...)</li>
  <li>addedBy(what is the compantHrId who is added this job)</li>
  <li>companyId</li>
</ol>

<h3 style = "color: blue; text-decoration: underline;">Application Collection</h3>
<ol>
  <li>jobId (the Job Id)</li>
  <li>userId (the applier Id)</li>
  <li>userTechSkills (array of the applier technical skills)</li>
  <li>userSoftSkills (array of the applier soft skills)</li>
  <li>userResume (must be pdf, upload this pdf on cloudinary)</li>
  <li>companyId</li>
</ol>

<h1>User APIs</h1>
<ol>
  <li>Sign Up</li>
  <li>Sign In</li>
    <ul>
      <li>Sign In using (email or mobileNumber) and password</li>
      <li>Don’t forget to update the status to online after SignIn</li>
    </ul>
  <li>Verify email</li>
  <li>Verify recovery email</li>
  <li>Update account</li>
    <ul>
      <li>You can update (email, mobileNumber, recoveryEmail, DOB, lastName, firstName)</li>
      <li>If user update the email, mobileNumber make sure that the new data doesn’t conflict with any existing data in your database</li>
      <li>User must be logged in</li>
      <li>Only the owner of the account can update his account data</li>
    </ul>
  <li>Delete account</li>
    <ul>
      <li>Only the owner of the account can delete his account data</li>
      <li>User must be logged in</li>
    </ul>
  <li>Get user account data</li>
    <ul>
      <li>Only the owner of the account can delete his account data</li>
      <li>User must be logged in</li>
    </ul>
  <li>Get profile data for another user</li>
    <ul>
      <li>Send the userId in params or query</li>
    </ul>
  <li>Update password</li>
  <li>Reset password</li>
  <li>Forget password (without sending any email, make sure of your data security specially the OTP and the newPassword)</li>
  <li>Get all accounts associated to a specific recovery Email</li>
</ol>
