# End-to-End Multi-Tenant Business Workflow Automated Test Suite
# Tests full integration across:
#   1. CoreService (Tenant creation, RBAC, Admin provisioning)
#   2. ClassService (Course, Branch, Academic entities)
#   3. AdmissionService (Public student application, tracking, admin review)
#   4. FeeService (Fee window schedules, student ledgers)
#   5. ApiGateway & Frontend Proxy (:8080 and :5173)

$gatewayUrl = "http://localhost:8080"
$frontendUrl = "http://localhost:5173"
$timestamp = Get-Date -Format "HHmmss"
$collegeCode = "TECH$timestamp"
$collegeName = "Tech Institute of Excellence $timestamp"

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
Write-Host "       FULL MULTI-TENANT END-TO-END BUSINESS WORKFLOW TEST SUITE          " -ForegroundColor Cyan
Write-Host "       Gateway: $gatewayUrl  |  Vite: $frontendUrl  |  Code: $collegeCode " -ForegroundColor Cyan
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
        Log-Step 1 "Main Admin Authentication" "PASS" "Logged in as MainAdmin001, token len: $($mainAdminToken.Length)"
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
# STEP 2: Create College (Tenant Provisioning)
# ----------------------------------------------------------------------------------
$collegeCreated = $false
try {
    $collegeBody = @{
        collegeName = $collegeName
        collegeCode = $collegeCode
        collegePhone = "+919876543210"
        collegeEmail = "admissions@$($collegeCode.ToLower()).edu"
        collegeAddress = "42 Campus Avenue, Electronic City"
        collegeCity = "Bangalore"
        collegeState = "Karnataka"
        collegeZip = "560100"
        collegeCountry = "India"
        universityName = "Karnataka Technological University"
        universityCode = "KTU-01"
        collegeDescription = "Premier Engineering and Research Institution"
        adminEmail = "admin@$($collegeCode.ToLower()).edu"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/core/college/createCollege" -Method Post -ContentType "application/json" -Headers $mainAdminHeaders -Body $collegeBody
    if ($res.success -eq $true) {
        Log-Step 2 "Tenant Creation (Create College)" "PASS" "College $collegeCode created successfully"
        $collegeCreated = $true
    } else {
        Log-Step 2 "Tenant Creation (Create College)" "FAIL" $res.message
    }
} catch {
    Log-Step 2 "Tenant Creation (Create College)" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 3: Retrieve Provisioned College Details
# ----------------------------------------------------------------------------------
$collegeId = $null
try {
    $college = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/core/college/public/code/$collegeCode" -Method Get
    $collegeId = $college.collegeId
    if ($collegeId) {
        Log-Step 3 "Retrieve College UUID" "PASS" "College ID: $collegeId | Name: $($college.collegeName)"
    } else {
        Log-Step 3 "Retrieve College UUID" "FAIL" "CollegeId not found in public query"
    }
} catch {
    Log-Step 3 "Retrieve College UUID" "FAIL" $_.Exception.Message
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
        Log-Step 4 "College Admin Authentication" "PASS" "Logged in as $collegeAdminUserId, token issued"
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
        courseName = "B.Tech Computer Science & Engineering"
        courseCode = "CSE-$timestamp"
        description = "Four-year Bachelor of Technology in Computer Science"
        durationInYears = 4
        totalSemesters = 8
    } | ConvertTo-Json

    $courseRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/course" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $courseBody
    $courseId = $courseRes.courseId
    if ($courseId) {
        Log-Step 5 "Create Course" "PASS" "Created Course: $($courseRes.courseName) (ID: $courseId)"
    } else {
        Log-Step 5 "Create Course" "FAIL" "No courseId returned in response"
    }
} catch {
    Log-Step 5 "Create Course" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 6: Create Academic Branch (ClassService)
# ----------------------------------------------------------------------------------
$branchId = $null
try {
    $branchBody = @{
        branchName = "Artificial Intelligence & Machine Learning"
        branchCode = "AIML-$timestamp"
        branchDescription = "Specialization in Deep Learning and AI"
    } | ConvertTo-Json

    $branchRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/class/branch/course/$courseId" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $branchBody
    $branchId = $branchRes.branchId
    if ($branchId) {
        Log-Step 6 "Create Branch" "PASS" "Created Branch: $($branchRes.branchName) (ID: $branchId)"
    } else {
        Log-Step 6 "Create Branch" "FAIL" "No branchId returned in response"
    }
} catch {
    Log-Step 6 "Create Branch" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 7: Public Student Admission Application (AdmissionService - No Auth)
# ----------------------------------------------------------------------------------
$applicationRef = $null
$applicationId = $null
try {
    $appBody = @{
        applicantName = "Aarav Sharma"
        email = "aarav.sharma.$timestamp@example.com"
        phoneNumber = "+919811223344"
        dateOfBirth = "2006-04-12"
        gender = "Male"
        address = "42 Silicon Valley Enclave, Bangalore"
        fatherName = "Rajesh Sharma"
        motherName = "Pooja Sharma"
        courseId = $courseId
        courseName = "B.Tech Computer Science & Engineering"
        branchId = $branchId
        branchName = "Artificial Intelligence & Machine Learning"
        previousQualification = "Higher Secondary (12th CBSE)"
        previousInstitution = "Delhi Public School"
        previousPercentage = 95.8
    } | ConvertTo-Json

    $appRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/admission/public/code/$collegeCode/apply" -Method Post -ContentType "application/json" -Body $appBody
    $applicationRef = $appRes.applicationNumber
    $applicationId = $appRes.id
    if ($applicationRef) {
        Log-Step 7 "Public Admission Submission" "PASS" "Application Number: $applicationRef | Status: $($appRes.status)"
    } else {
        Log-Step 7 "Public Admission Submission" "FAIL" "No application number generated"
    }
} catch {
    $err = if ($_.Exception.Response) { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } else { $_.Exception.Message }
    Log-Step 7 "Public Admission Submission" "FAIL" "Err: $err"
}

# ----------------------------------------------------------------------------------
# STEP 8: Public Applicant Dossier Tracking (AdmissionService)
# ----------------------------------------------------------------------------------
try {
    $trackRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/admission/public/track/$applicationRef" -Method Get
    if ($trackRes.applicationNumber -eq $applicationRef -and $trackRes.status -eq "SUBMITTED") {
        Log-Step 8 "Public Application Tracking" "PASS" "Tracked successfully: $($trackRes.applicantName), Status: $($trackRes.status)"
    } else {
        Log-Step 8 "Public Application Tracking" "FAIL" "Unexpected status: $($trackRes.status)"
    }
} catch {
    Log-Step 8 "Public Application Tracking" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 9: Admin Review of Submitted Application (AdmissionService)
# ----------------------------------------------------------------------------------
try {
    $reviewUrl = "$gatewayUrl/api/v1/admission/applications/$applicationId/review"
    $reviewOutput = curl.exe -s -X PATCH $reviewUrl -H "Authorization: Bearer $collegeAdminToken" -H "CollegeId: $collegeId"
    $reviewRes = $reviewOutput | ConvertFrom-Json
    if ($reviewRes.status -eq "UNDER_REVIEW") {
        Log-Step 9 "Admin Application Review" "PASS" "Status updated to UNDER_REVIEW"
    } else {
        Log-Step 9 "Admin Application Review" "FAIL" "Status is: $($reviewRes.status) | Raw: $reviewOutput"
    }
} catch {
    Log-Step 9 "Admin Application Review" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# STEP 10: Create Fee Form Window Schedule (FeeService)
# ----------------------------------------------------------------------------------
$feeWindowId = $null
try {
    $windowBody = @{
        formName = "Fall 2026 Semester Tuition Fee Window"
        openAt = (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ss")
        closeAt = (Get-Date).AddMonths(1).ToString("yyyy-MM-ddTHH:mm:ss")
        active = $true
    } | ConvertTo-Json

    $windowRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/fee/forms" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $windowBody
    $feeWindowId = $windowRes.id
    Log-Step 10 "Schedule Fee Window" "PASS" "Fee Window created: $($windowRes.formName), Active: $($windowRes.active)"
} catch {
    $err = if ($_.Exception.Response) { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } else { $_.Exception.Message }
    Log-Step 10 "Schedule Fee Window" "FAIL" "Err: $err"
}

# ----------------------------------------------------------------------------------
# STEP 11: Create Student Fee Account Ledger (FeeService)
# ----------------------------------------------------------------------------------
$feeAccountId = $null
try {
    $feeBody = @{
        studentUserId = "$($collegeCode)-STU-001"
        studentName = "Aarav Sharma"
        courseId = $courseId
        courseName = "B.Tech Computer Science & Engineering"
        branchId = $branchId
        branchName = "Artificial Intelligence & Machine Learning"
        totalFee = 75000.00
    } | ConvertTo-Json

    $feeRes = Invoke-RestMethod -Uri "$gatewayUrl/api/v1/fee" -Method Post -ContentType "application/json" -Headers $tenantHeaders -Body $feeBody
    $feeAccountId = $feeRes.id
    Log-Step 11 "Create Student Fee Account" "PASS" "Fee account created for $($feeRes.studentName), Total: $($feeRes.totalFee)"
} catch {
    $err = if ($_.Exception.Response) { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } else { $_.Exception.Message }
    Log-Step 11 "Create Student Fee Account" "FAIL" "Err: $err"
}

# ----------------------------------------------------------------------------------
# STEP 12: Frontend Vite Reverse-Proxy Compatibility Check
# ----------------------------------------------------------------------------------
try {
    # Query the college list through Vite dev server proxy (:5173 -> :8080 -> :8082)
    $viteColleges = Invoke-RestMethod -Uri "$frontendUrl/api/v1/core/college/allCollege" -Method Get -Headers $mainAdminHeaders
    $viteCount = $viteColleges.colleges.totalElements
    Log-Step 12 "Frontend Vite Proxy Forwarding" "PASS" "Retrieved $viteCount colleges through Vite proxy on :5173"
} catch {
    Log-Step 12 "Frontend Vite Proxy Forwarding" "FAIL" $_.Exception.Message
}

# ----------------------------------------------------------------------------------
# SUMMARY REPORT
# ----------------------------------------------------------------------------------
Write-Host "`n==========================================================================" -ForegroundColor Cyan
Write-Host "                      WORKFLOW VERIFICATION REPORT                        " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
$passed = ($testResults | Where-Object Status -eq "PASS").Count
$total = $testResults.Count
Write-Host "Total Business Steps Tested: $total" -ForegroundColor White
Write-Host "Passed: $passed / $total" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host "==========================================================================" -ForegroundColor Cyan
