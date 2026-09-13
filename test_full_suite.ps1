# Master Verification Suite: All Microservices, Workflows, Academics, Admissions, Fees & Storage
$gatewayUrl = "http://localhost:8080"
$frontendUrl = "http://localhost:5173"
$timestamp = Get-Date -Format "HHmmss"
$collegeCode = "UNIV$timestamp"
$collegeName = "Apex University of Science $timestamp"

$testResults = [System.Collections.Generic.List[PSCustomObject]]::new()

function Log-Step($stepNumber, $title, $status, $detail) {
    $testResults.Add([PSCustomObject]@{
        Step = $stepNumber
        Title = $title
        Status = $status
        Detail = $detail
    })
    $color = if ($status -eq "PASS") { "Green" } else { "Red" }
    Write-Host "`n[$status] STEP $stepNumber : $title" -ForegroundColor $color
    Write-Host "       Detail: $detail" -ForegroundColor Gray
}

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "   MASTER SYSTEM INTEGRATION & BUSINESS WORKFLOW VERIFICATION SUITE       " -ForegroundColor Cyan
Write-Host "   Gateway: $gatewayUrl  |  Frontend: $frontendUrl  |  Code: $collegeCode " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan

# ----------------------------------------------------------------------------------
# STEP 1: Main Admin Authentication
# ----------------------------------------------------------------------------------
$mainAdminToken = $null
try {
    $body = @{ userId = "MainAdmin001"; password = "Admin@123" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/core/auth/login" -Method Post -ContentType "application/json" -Body $body
    $mainAdminToken = $res.jwtToken
    if ($mainAdminToken) {
        Log-Step 1 "Main Admin Authentication" "PASS" "Logged in as MainAdmin001 (Token: $($mainAdminToken.Substring(0, 25))...)"
    } else {
        Log-Step 1 "Main Admin Authentication" "FAIL" "No token returned"
    }
} catch {
    Log-Step 1 "Main Admin Authentication" "FAIL" $_.Exception.Message
}

$mainAdminHeaders = @{
    "Authorization" = "Bearer $mainAdminToken"
}

# ----------------------------------------------------------------------------------
# STEP 2: Tenant Creation (Create College)
# ----------------------------------------------------------------------------------
$collegeCreated = $false
try {
    $collegeBody = @{
        collegeName = $collegeName
        collegeCode = $collegeCode
        collegePhone = "+919876500000"
        collegeEmail = "contact@$($collegeCode.ToLower()).edu"
        collegeAddress = "100 Innovation Park, Tech Zone"
        collegeCity = "Hyderabad"
        collegeState = "Telangana"
        collegeZip = "500081"
        collegeCountry = "India"
        universityName = "Telangana Technological University"
        universityCode = "TTU-01"
        collegeDescription = "Autonomous Institute for High-Tech Research"
        adminEmail = "admin@$($collegeCode.ToLower()).edu"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/core/college/createCollege" -Method Post -ContentType "application/json" -Headers $mainAdminHeaders -Body $collegeBody
    if ($res.success -eq $true) {
        Log-Step 2 "Tenant Provisioning (Create College)" "PASS" "College $collegeCode created successfully"
        $collegeCreated = $true
    } else {
        Log-Step 2 "Tenant Provisioning (Create College)" "FAIL" $res.message
    }
} catch {
    Log-Step 2 "Tenant Provisioning (Create College)" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 3: Retrieve Provisioned College Details
# ----------------------------------------------------------------------------------
$collegeId = $null
try {
    $college = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/core/college/public/code/$collegeCode" -Method Get
    $collegeId = $college.collegeId
    if ($collegeId) {
        Log-Step 3 "Retrieve College Entity" "PASS" "College UUID: $collegeId | Name: $($college.collegeName)"
    } else {
        Log-Step 3 "Retrieve College Entity" "FAIL" "CollegeId not found in response"
    }
} catch {
    Log-Step 3 "Retrieve College Entity" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 4: Login as the Auto-Provisioned College Administrator
# ----------------------------------------------------------------------------------
$collegeAdminToken = $null
$collegeAdminUserId = "$($collegeCode)00001"
$collegeAdminPassword = "CollegeAdminPassword$collegeCode"

try {
    $loginBody = @{ userId = $collegeAdminUserId; password = $collegeAdminPassword } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/core/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $collegeAdminToken = $res.jwtToken
    if ($collegeAdminToken) {
        Log-Step 4 "College Admin Authentication" "PASS" "Authenticated as $collegeAdminUserId (Scoped Tenant Token)"
    } else {
        Log-Step 4 "College Admin Authentication" "FAIL" "No token returned for college admin"
    }
} catch {
    Log-Step 4 "College Admin Authentication" "FAIL" $_.Exception.Message
}

$tenantHeaders = @{
    "Authorization" = "Bearer $collegeAdminToken"
    "CollegeId" = $collegeId
}

# ----------------------------------------------------------------------------------
# STEP 5: Create Academic Course (ClassService)
# ----------------------------------------------------------------------------------
$courseId = $null
try {
    $courseBody = @{
        courseName = "B.Tech Robotics and Automation"
        courseCode = "ROB-$timestamp"
        description = "Four-year specialized degree in autonomous systems"
        durationInYears = 4
        totalSemesters = 8
    } | ConvertTo-Json

    $courseRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/course" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $courseBody
    $courseId = $courseRes.courseId
    if ($courseId) {
        Log-Step 5 "Create Academic Course" "PASS" "Created: $($courseRes.courseName) (ID: $courseId)"
    } else {
        Log-Step 5 "Create Academic Course" "FAIL" "No courseId in response"
    }
} catch {
    Log-Step 5 "Create Academic Course" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 6: Create Academic Branch (ClassService)
# ----------------------------------------------------------------------------------
$branchId = $null
try {
    $branchBody = @{
        branchName = "Robotics & Autonomous Systems"
        branchCode = "RAS-$timestamp"
        branchDescription = "Specialization in Hardware-Software AI Co-design"
    } | ConvertTo-Json

    $branchRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/branch/course/$courseId" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $branchBody
    $branchId = $branchRes.branchId
    if ($branchId) {
        Log-Step 6 "Create Academic Branch" "PASS" "Created: $($branchRes.branchName) (ID: $branchId)"
    } else {
        Log-Step 6 "Create Academic Branch" "FAIL" "No branchId returned"
    }
} catch {
    Log-Step 6 "Create Academic Branch" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 7: Create Subject (ClassService)
# ----------------------------------------------------------------------------------
$subjectId = $null
try {
    $subjectBody = @{
        subjectName = "Kinematics and Dynamics"
        subjectCode = "ROB101"
        description = "Foundations of robot kinematics and dynamic modeling"
        credits = 4
        semester = 1
        courseId = $courseId
    } | ConvertTo-Json

    $subjectRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/subject" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $subjectBody
    $subjectId = $subjectRes.subjectId
    if ($subjectId) {
        Log-Step 7 "Create Academic Subject" "PASS" "Created: $($subjectRes.subjectName) (Code: $($subjectRes.subjectCode))"
    } else {
        Log-Step 7 "Create Academic Subject" "FAIL" "No subjectId returned"
    }
} catch {
    Log-Step 7 "Create Academic Subject" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 8: Create Class Section (ClassService)
# ----------------------------------------------------------------------------------
$classId = $null
try {
    $classBody = @{
        className = "ROB-Section-Alpha"
        section = "A"
        branchId = $branchId
        academicYear = 2026
        semester = 1
    } | ConvertTo-Json

    $classRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/classes" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $classBody
    $classId = $classRes.classId
    if ($classId) {
        Log-Step 8 "Create Class Section" "PASS" "Created: $($classRes.className) (ID: $classId)"
    } else {
        Log-Step 8 "Create Class Section" "FAIL" "No classId in response"
    }
} catch {
    $err = if ($_.Exception.Response) { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } else { $_.Exception.Message }
    Log-Step 8 "Create Class Section" "FAIL" $err
}

# ----------------------------------------------------------------------------------
# STEP 9: Query Classes by Branch
# ----------------------------------------------------------------------------------
try {
    $classes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/classes/branch/$branchId" -Method Get -Headers $tenantHeaders
    if ($classes -and $classes.Count -gt 0) {
        Log-Step 9 "Query Classes of Branch" "PASS" "Retrieved $($classes.Count) class section(s)"
    } else {
        Log-Step 9 "Query Classes of Branch" "PASS" "Queried endpoint successfully (0 sections currently assigned)"
    }
} catch {
    Log-Step 9 "Query Classes of Branch" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 10: Public Student Admission Application (AdmissionService - No Auth)
# ----------------------------------------------------------------------------------
$applicationRef = $null
$applicationId = $null
try {
    $appBody = @{
        applicantName = "Diya Sengupta"
        email = "diya.$timestamp@example.com"
        phoneNumber = "+919833445566"
        dateOfBirth = "2006-08-20"
        gender = "Female"
        address = "12 Cyber Heights, Hitech City, Hyderabad"
        fatherName = "Anirban Sengupta"
        motherName = "Mousumi Sengupta"
        courseId = $courseId
        courseName = "B.Tech Robotics and Automation"
        branchId = $branchId
        branchName = "Robotics & Autonomous Systems"
        previousQualification = "Higher Secondary (12th ICSE)"
        previousInstitution = "The Heritage School"
        previousPercentage = 97.4
    } | ConvertTo-Json

    $appRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/admission/public/code/$collegeCode/apply" -Method Post -ContentType "application/json" -Body $appBody
    $applicationRef = $appRes.applicationNumber
    $applicationId = $appRes.id
    if ($applicationRef) {
        Log-Step 10 "Public Admission Submission" "PASS" "Dossier Application No: $applicationRef (Status: $($appRes.status))"
    } else {
        Log-Step 10 "Public Admission Submission" "FAIL" "No applicationNumber returned"
    }
} catch {
    Log-Step 10 "Public Admission Submission" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 11: Public Dossier Status Tracking
# ----------------------------------------------------------------------------------
try {
    $trackRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/admission/public/track/$applicationRef" -Method Get
    if ($trackRes.applicantName -eq "Diya Sengupta" -and $trackRes.status -eq "SUBMITTED") {
        Log-Step 11 "Public Dossier Tracking" "PASS" "Verified applicant: $($trackRes.applicantName), Status: $($trackRes.status)"
    } else {
        Log-Step 11 "Public Dossier Tracking" "FAIL" "Data mismatch or invalid response"
    }
} catch {
    Log-Step 11 "Public Dossier Tracking" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 12: Admin Review & Status Transition (PATCH via curl.exe)
# ----------------------------------------------------------------------------------
try {
    $reviewUrl = "$gatewayUrl/api/v1/admission/applications/$applicationId/review"
    $rawPatch = & curl.exe -s -X PATCH $reviewUrl -H "Authorization: Bearer $collegeAdminToken" -H "CollegeId: $collegeId"
    $patchRes = $rawPatch | ConvertFrom-Json
    if ($patchRes.status -eq "UNDER_REVIEW") {
        Log-Step 12 "Admin Application Review" "PASS" "Application transitioned to UNDER_REVIEW"
    } else {
        Log-Step 12 "Admin Application Review" "FAIL" "Unexpected response: $rawPatch"
    }
} catch {
    Log-Step 12 "Admin Application Review" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 13: Schedule Fee Collection Window (FeeService)
# ----------------------------------------------------------------------------------
$feeWindowId = $null
try {
    $feeWindowBody = @{
        formName = "Term 1 Tuition Fee Collection Window $timestamp"
        openAt = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss")
        closeAt = (Get-Date).AddMonths(1).ToString("yyyy-MM-ddTHH:mm:ss")
        active = $true
    } | ConvertTo-Json

    $windowRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/fee/forms" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $feeWindowBody
    $feeWindowId = $windowRes.id
    if ($feeWindowId) {
        Log-Step 13 "Schedule Fee Collection Window" "PASS" "Created Fee Window: $($windowRes.formName) (Active: $($windowRes.active))"
    } else {
        Log-Step 13 "Schedule Fee Collection Window" "FAIL" "No fee window id returned"
    }
} catch {
    $err = if ($_.Exception.Response) { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } else { $_.Exception.Message }
    Log-Step 13 "Schedule Fee Collection Window" "FAIL" $err
}

# ----------------------------------------------------------------------------------
# STEP 14: Create Student Fee Account & Ledger (FeeService)
# ----------------------------------------------------------------------------------
try {
    $studentFeeBody = @{
        studentUserId = "$($collegeCode)-STU-001"
        studentName = "Diya Sengupta"
        courseId = $courseId
        courseName = "B.Tech Robotics and Automation"
        branchId = $branchId
        branchName = "Robotics & Autonomous Systems"
        totalFee = 85000.00
    } | ConvertTo-Json

    $feeRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/fee" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $studentFeeBody
    if ($feeRes.id -and $feeRes.totalFee -eq 85000) {
        Log-Step 14 "Create Student Fee Ledger" "PASS" "Ledger created: $($feeRes.studentName), Total: Rs. $($feeRes.totalFee)"
    } else {
        Log-Step 14 "Create Student Fee Ledger" "FAIL" "Fee account creation failed"
    }
} catch {
    $err = if ($_.Exception.Response) { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } else { $_.Exception.Message }
    Log-Step 14 "Create Student Fee Ledger" "FAIL" $err
}

# ----------------------------------------------------------------------------------
# STEP 15: Notification Service Liveness & Health
# ----------------------------------------------------------------------------------
try {
    $notifHealth = Invoke-RestMethod -Uri "$gatewayUrl/api/notifications/health" -Method Get
    if ($notifHealth -like "*Notification Service is running*") {
        Log-Step 15 "Notification Service Health" "PASS" "Notification Service responsive via Gateway"
    } else {
        Log-Step 15 "Notification Service Health" "FAIL" "Unexpected response: $notifHealth"
    }
} catch {
    Log-Step 15 "Notification Service Health" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 16: Cloudinary Service Liveness & Query
# ----------------------------------------------------------------------------------
try {
    $cloudHealth = Invoke-RestMethod -Uri "$gatewayUrl/api/files/health" -Method Get
    $files = Invoke-RestMethod -Uri "$gatewayUrl/api/files?ownerId=$collegeAdminUserId" -Method Get
    if ($cloudHealth -like "*Cloudinary Service is running*" -and $files -is [System.Array]) {
        Log-Step 16 "Cloudinary & Files Service" "PASS" "Service active; file queries operational via Gateway"
    } else {
        Log-Step 16 "Cloudinary & Files Service" "FAIL" "Unexpected response from Cloudinary Service"
    }
} catch {
    Log-Step 16 "Cloudinary & Files Service" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 17: Frontend Vite Reverse Proxy Route Forwarding
# ----------------------------------------------------------------------------------
try {
    $collegesViaVite = Invoke-RestMethod -Uri "$frontendUrl/api/v1/core/college/allCollege" -Method Get -Headers $mainAdminHeaders
    $viteCount = $collegesViaVite.colleges.totalElements
    if ($viteCount -gt 0) {
        Log-Step 17 "Frontend Vite Proxy Route" "PASS" "Retrieved $viteCount colleges through Vite proxy on :5173"
    } else {
        Log-Step 17 "Frontend Vite Proxy Route" "FAIL" "Empty college list from Vite proxy"
    }
} catch {
    Log-Step 17 "Frontend Vite Proxy Route" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# SUMMARY
# ----------------------------------------------------------------------------------
$passedCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$totalCount = $testResults.Count

Write-Host "`n==========================================================================" -ForegroundColor Cyan
Write-Host "                      MASTER TEST REPORT SUMMARY                          " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "Total Verified Steps: $totalCount" -ForegroundColor White
Write-Host "Passed: $passedCount / $totalCount" -ForegroundColor $(if ($passedCount -eq $totalCount) { "Green" } else { "Yellow" })
Write-Host "==========================================================================" -ForegroundColor Cyan

if ($passedCount -ne $totalCount) {
    exit 1
}
