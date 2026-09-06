$project = "EmployerNext"
$src = "C:\IISSites\$project"
$backupRoot = "C:\backup"
$date = Get-Date -Format "yyyyMMdd_HHmmss"
$folder = "${project}_$date"

$dest = Join-Path $backupRoot $folder

try {
    # Create the backup directory if it doesn't exist
    if (!(Test-Path -Path $dest)) {
        New-Item -ItemType Directory -Path $dest | Out-Null
    }

    # Copy the entire folder structure including root and subfolders
    Copy-Item -Path $src -Destination $dest -Recurse -Force

    Write-Host "✅ Backup completed to $dest"
} catch {
    Write-Error "❌ Backup failed: $_"
    exit 1
}
