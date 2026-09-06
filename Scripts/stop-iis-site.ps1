$siteName = "EmployerNext"
$appPoolName = "AppPool_EmployerNext"  # Use your real app pool name if different

$appCmdPath = "$env:SystemRoot\System32\inetsrv\appcmd.exe"

# Check if appcmd exists
if (-Not (Test-Path $appCmdPath)) {
    Write-Error "appcmd.exe not found at $appCmdPath"
    exit 1
}

# Stop IIS Site
Write-Output "Stopping IIS site: $siteName"
& $appCmdPath stop site /site.name:"$siteName"

# Stop App Pool
Write-Output "Stopping App Pool: $appPoolName"
& $appCmdPath stop apppool /apppool.name:"$appPoolName"

# Wait and check status for up to 3 minutes
$maxWaitSeconds = 180
$intervalSeconds = 10
$elapsedSeconds = 0

while ($elapsedSeconds -lt $maxWaitSeconds) {
    Start-Sleep -Seconds $intervalSeconds
    $elapsedSeconds += $intervalSeconds

    $siteStatus = & $appCmdPath list site "$siteName"
    $appPoolStatus = & $appCmdPath list apppool "$appPoolName"

    $siteStopped = $siteStatus -match "state:Stopped"
    $appPoolStopped = $appPoolStatus -match "state:Stopped"

    if ($siteStopped -and $appPoolStopped) {
        Write-Output "✅ Site '$siteName' and App Pool '$appPoolName' successfully stopped after $elapsedSeconds seconds."
        break
    } else {
        Write-Output "⏳ Waiting... Site: $([bool]$siteStopped), App Pool: $([bool]$appPoolStopped)"
    }
}

# Final check and warning
if (-not $siteStopped -or -not $appPoolStopped) {
    Write-Warning "⚠️ Timeout reached. Final status - Site: $([bool]$siteStopped), App Pool: $([bool]$appPoolStopped)"
}