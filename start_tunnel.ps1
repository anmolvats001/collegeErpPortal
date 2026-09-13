# Start Secure Public Tunnel to API Gateway (:8080)
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Starting Public HTTPS Tunnel for College ERP   " -ForegroundColor Cyan
Write-Host " Forwarding traffic to ApiGateway (Port 8080)... " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

ssh -o StrictHostKeyChecking=no -R 80:localhost:8080 nokey@localhost.run
