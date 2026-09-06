# Safe cleanup script
$target = "C:\IISSites\EmployerNext"
if (Test-Path $target) {
    Remove-Item -Recurse -Force "$target\*" -ErrorAction SilentlyContinue
    Write-Output "Cleared existing contents from $target"
}