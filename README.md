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
