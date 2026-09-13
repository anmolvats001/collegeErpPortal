# Check Status of Backend Microservices & Frontend

$services = @(
    @{ Name = "ApiGateway"; Port = 8080; Expected = "Gateway / Proxy" },
    @{ Name = "CoreService"; Port = 8082; Expected = "Auth & Tenant Core" },
    @{ Name = "ClassService"; Port = 8083; Expected = "Academics & Chat" },
    @{ Name = "AdmissionService"; Port = 8084; Expected = "Admissions" },
    @{ Name = "FeeService"; Port = 8085; Expected = "Fee Management" },
    @{ Name = "NotificationService"; Port = 8086; Expected = "Notifications" },
    @{ Name = "CloudinaryService"; Port = 8087; Expected = "Files & Cloudinary" },
    @{ Name = "Frontend (Vite)"; Port = 5173; Expected = "React SPA" }
)

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "                SYSTEM SERVICE STATUS                    " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$allUp = $true
foreach ($s in $services) {
    $conn = Get-NetTCPConnection -LocalPort $s.Port -ErrorAction SilentlyContinue | Where-Object State -eq 'Listen' | Select-Object -First 1
    if ($conn) {
        Write-Host ("  [UP]   {0,-20} Port: {1,-5} PID: {2,-6} ({3})" -f $s.Name, $s.Port, $conn.OwningProcess, $s.Expected) -ForegroundColor Green
    } else {
        Write-Host ("  [DOWN] {0,-20} Port: {1,-5} ({2})" -f $s.Name, $s.Port, $s.Expected) -ForegroundColor Red
        $allUp = $false
    }
}
Write-Host "========================================================`n" -ForegroundColor Cyan

if ($allUp) {
    Write-Host "All backend and frontend services are UP and listening!" -ForegroundColor Green
} else {
    Write-Host "Some services are still starting or offline. Check logs in C:\Antigravity\MultiTenantFrontend\logs." -ForegroundColor Yellow
}
