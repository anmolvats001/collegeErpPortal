$ports = @(8080, 8082, 8083, 8084, 8085, 8086, 8087, 5173)
foreach ($p in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | Where-Object State -eq 'Listen'
    foreach ($c in $conns) {
        Write-Host "Stopping PID $($c.OwningProcess) on port $p"
        Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "All ports freed."

