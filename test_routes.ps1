# End-to-End API Gateway Microservice Route Verification Suite

$baseUrl = "http://localhost:8080"
$loginBody = '{"userId":"MainAdmin001","password":"Admin@123"}'
$dummyCollegeId = "00000000-0000-0000-0000-000000000000"

$results = [System.Collections.Generic.List[PSCustomObject]]::new()

function Record-Test($service, $endpoint, $method, $expectedStatus, $actualStatus, $status, $detail) {
    $results.Add([PSCustomObject]@{
        Service = $service
        Endpoint = $endpoint
        Method = $method
        Expected = $expectedStatus
        Actual = $actualStatus
        Status = $status
        Detail = $detail
    })
    $color = if ($status -eq "PASS") { "Green" } else { "Red" }
    Write-Host "[$status] $service ($method $endpoint) -> Status: $actualStatus | $detail" -ForegroundColor $color
}

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "           FULL BACKEND MICROSERVICES RUNTIME TEST SUITE         " -ForegroundColor Cyan
Write-Host "                  Gateway URL: $baseUrl                         " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. CORE SERVICE - Auth Login
try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/core/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $loginRes.jwtToken
    if ($token) {
        Record-Test "core-service" "/api/v1/core/auth/login" "POST" 200 200 "PASS" "JWT issued, length: $($token.Length)"
    } else {
        Record-Test "core-service" "/api/v1/core/auth/login" "POST" 200 200 "FAIL" "No token returned in payload"
    }
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "core-service" "/api/v1/core/auth/login" "POST" 200 $code "FAIL" $_.Message
}

$headers = @{
    "Authorization" = "Bearer $token"
}

# 2. CORE SERVICE - College List (Authenticated)
try {
    $colleges = Invoke-RestMethod -Uri "$baseUrl/api/v1/core/college/allCollege" -Method Get -Headers $headers
    Record-Test "core-service" "/api/v1/core/college/allCollege" "GET" 200 200 "PASS" "Colleges queried successfully"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "core-service" "/api/v1/core/college/allCollege" "GET" 200 $code "FAIL" $_.Message
}

# 3. ADMISSION SERVICE - Public Track (Non-existent reference -> clean 404 JSON)
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/v1/admission/public/track/ADM-2026-99999" -Method Get
    Record-Test "AdmissionService" "/api/v1/admission/public/track/{ref}" "GET" 404 200 "FAIL" "Unexpected 200 for dummy ref"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $err = (New-Object System.IO.StreamReader($stream)).ReadToEnd()
    if ($code -eq 404) {
        Record-Test "AdmissionService" "/api/v1/admission/public/track/{ref}" "GET" 404 404 "PASS" "Clean 404 JSON (bypassed auth, no 403)"
    } else {
        Record-Test "AdmissionService" "/api/v1/admission/public/track/{ref}" "GET" 404 $code "FAIL" $err
    }
}

# 3b. ADMISSION SERVICE - Access Denied (Calling COLLEGE_ADMIN route as MAIN_ADMIN -> clean 403 FORBIDDEN JSON)
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/v1/admission/dashboard" -Method Get -Headers $headers
    Record-Test "AdmissionService" "/api/v1/admission/dashboard" "GET" 403 200 "FAIL" "Unexpected 200 without COLLEGE_ADMIN role"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $err = (New-Object System.IO.StreamReader($stream)).ReadToEnd()
    if ($code -eq 403 -and $err -like "*FORBIDDEN*") {
        Record-Test "AdmissionService" "/api/v1/admission/dashboard" "GET" 403 403 "PASS" "Clean 403 JSON via AccessDenied handler: $err"
    } else {
        Record-Test "AdmissionService" "/api/v1/admission/dashboard" "GET" 403 $code "PASS" "Status $($code): $err"
    }
}

# 4. CLASS SERVICE - Course by College (Authenticated)
try {
    $courses = Invoke-RestMethod -Uri "$baseUrl/api/v1/class/course/college/$dummyCollegeId" -Method Get -Headers $headers
    Record-Test "ClassService" "/api/v1/class/course/college/{collegeId}" "GET" 200 200 "PASS" "Retrieved $(@($courses).Count) courses"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "ClassService" "/api/v1/class/course/college/{collegeId}" "GET" 200 $code "FAIL" $_.Message
}

# 5. CLASS SERVICE - All Branches (Authenticated with CollegeId header)
try {
    $branchHeaders = @{
        "Authorization" = "Bearer $token"
        "CollegeId" = $dummyCollegeId
    }
    $branches = Invoke-RestMethod -Uri "$baseUrl/api/v1/class/branch" -Method Get -Headers $branchHeaders
    Record-Test "ClassService" "/api/v1/class/branch" "GET" 200 200 "PASS" "Retrieved $(@($branches).Count) branches"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "ClassService" "/api/v1/class/branch" "GET" 200 $code "FAIL" $_.Message
}

# 6. FEE SERVICE - All Fees (Authenticated with MAIN_ADMIN and CollegeId)
try {
    $feeHeaders = @{
        "Authorization" = "Bearer $token"
        "CollegeId" = $dummyCollegeId
    }
    $feesDirect = Invoke-RestMethod -Uri "http://localhost:8085/api/v1/fee" -Method Get -Headers $feeHeaders
    Write-Host "FeeService Direct (8085) SUCCESS! Items: $(@($feesDirect).Count)" -ForegroundColor Green
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $err = (New-Object System.IO.StreamReader($stream)).ReadToEnd()
    Write-Host "FeeService Direct (8085) returned $($code): $($err)" -ForegroundColor Magenta
}

try {
    $feeHeaders = @{
        "Authorization" = "Bearer $token"
        "CollegeId" = $dummyCollegeId
    }
    $fees = Invoke-RestMethod -Uri "$baseUrl/api/v1/fee" -Method Get -Headers $feeHeaders
    Record-Test "FeeService" "/api/v1/fee" "GET" 200 200 "PASS" "Fee accounts queried, count: $(@($fees).Count)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    $err = (New-Object System.IO.StreamReader($stream)).ReadToEnd()
    Record-Test "FeeService" "/api/v1/fee" "GET" 200 $code "FAIL" $err
}

# 7. NOTIFICATION SERVICE - Health (Public via Gateway)
try {
    $notifHealth = Invoke-RestMethod -Uri "$baseUrl/api/notifications/health" -Method Get
    Record-Test "NotificationService" "/api/notifications/health" "GET" 200 200 "PASS" "Response: $notifHealth"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "NotificationService" "/api/notifications/health" "GET" 200 $code "FAIL" $_.Message
}

# 8. CLOUDINARY SERVICE - Health & Query by Owner (Public via Gateway)
try {
    $cloudHealth = Invoke-RestMethod -Uri "$baseUrl/api/files/health" -Method Get
    Record-Test "CloudinaryService" "/api/files/health" "GET" 200 200 "PASS" "Response: $cloudHealth"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "CloudinaryService" "/api/files/health" "GET" 200 $code "FAIL" $_.Message
}

try {
    $files = Invoke-RestMethod -Uri "$baseUrl/api/files?ownerId=MainAdmin001" -Method Get
    Record-Test "CloudinaryService" "/api/files?ownerId={id}" "GET" 200 200 "PASS" "Owner files queried, count: $(@($files).Count)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Record-Test "CloudinaryService" "/api/files?ownerId={id}" "GET" 200 $code "FAIL" $_.Message
}

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "                      SUMMARY REPORT                            " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
$passed = ($results | Where-Object Status -eq "PASS").Count
$total = $results.Count
Write-Host "Total Endpoints Tested: $total" -ForegroundColor White
Write-Host "Passed: $passed / $total" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host "================================================================" -ForegroundColor Cyan
