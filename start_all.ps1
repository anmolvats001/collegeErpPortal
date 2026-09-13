# Start All Backend Microservices & Frontend

$baseDir = "C:\Antigravity\MultiTenantFrontend"
$logDir = "$baseDir\logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Starting Multi-Tenant ERP Microservices & Frontend " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$services = @(
    @{ Name = "CoreService"; Path = "$baseDir\backend\core-service"; Port = 8082; Log = "$logDir\core-service.log" },
    @{ Name = "ApiGateway"; Path = "$baseDir\backend\ApiGateway\ApiGateway"; Port = 8080; Log = "$logDir\api-gateway.log" },
    @{ Name = "ClassService"; Path = "$baseDir\backend\ClassService\ClassService"; Port = 8083; Log = "$logDir\class-service.log" },
    @{ Name = "AdmissionService"; Path = "$baseDir\backend\AdmissionService\AdmissionService"; Port = 8084; Log = "$logDir\admission-service.log" },
    @{ Name = "FeeService"; Path = "$baseDir\backend\FeeService"; Port = 8085; Log = "$logDir\fee-service.log" },
    @{ Name = "NotificationService"; Path = "$baseDir\backend\NotificationService"; Port = 8086; Log = "$logDir\notification-service.log" },
    @{ Name = "CloudinaryService"; Path = "$baseDir\backend\CloudinaryService"; Port = 8087; Log = "$logDir\cloudinary-service.log" }
)

foreach ($s in $services) {
    $conns = Get-NetTCPConnection -LocalPort $s.Port -ErrorAction SilentlyContinue | Where-Object State -eq 'Listen'
    if ($conns) {
        Write-Host "[$($s.Name)] Already running on port $($s.Port)." -ForegroundColor Yellow
    } else {
        Write-Host "[$($s.Name)] Starting on port $($s.Port)..." -ForegroundColor Green
        Start-Process -FilePath "cmd.exe" -ArgumentList "/c mvnw.cmd spring-boot:run `"-Dspring-boot.run.jvmArguments=-Xms128m -Xmx320m`" > `"$($s.Log)`" 2>&1" -WorkingDirectory $s.Path -WindowStyle Hidden
    }
}

# Frontend
$frontConn = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Where-Object State -eq 'Listen'
if ($frontConn) {
    Write-Host "[Frontend] Already running on port 5173." -ForegroundColor Yellow
} else {
    Write-Host "[Frontend] Starting Vite Dev Server on port 5173..." -ForegroundColor Green
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev > `"$logDir\frontend.log`" 2>&1" -WorkingDirectory "$baseDir\frontend" -WindowStyle Hidden
}

Write-Host "`nAll processes initiated. Monitoring startup ports..." -ForegroundColor Cyan
