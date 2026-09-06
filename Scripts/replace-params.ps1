$AppName = "EmployerNext"
$Region = "us-east-1"
$ConfigPath = "EmployerNext\bin\Release\net8.0\win-x64\publish\appsettings.json"
$TagNameValue="feweb"

Import-Module AWS.Tools.SimpleSystemsManagement
 
# Build SSM path
$SSMBasePath = "/" + $TagNameValue.ToLower() + "/" + $AppName.ToLower() + "/"
Write-Host "Using SSM Base Path: $SSMBasePath"

# Load appsettings.json as JSON
if (-Not (Test-Path $ConfigPath)) {
    Write-Error "appsettings.json not found at $ConfigPath"
    exit 1
}
$json = Get-Content $ConfigPath -Raw | ConvertFrom-Json

# --- Update MySettings dynamically (case-insensitive, all lowercase) ---
if ($json.MySettings) {
    foreach ($key in $json.MySettings.PSObject.Properties.Name) {
        $keyName = $key.ToLower()
        $ssmParam = "$SSMBasePath$keyName"

        try {
            $paramValue = (Get-SSMParameter -Name $ssmParam -Region $Region -WithDecryption $true -ErrorAction Stop).Value
            if (-not [string]::IsNullOrWhiteSpace($paramValue)) {
                $json.MySettings.$key = $paramValue
                Write-Host "Updated MySettings key '$keyName' with value from SSM ($ssmParam)."
            } else {
                Write-Warning "Value for SSM parameter $ssmParam is null or empty!"
            }
        } catch {
            Write-Warning "SSM parameter $ssmParam not found or error occurred."
        }
    }
}

# --- Update ConnectionStrings dynamically (case-insensitive, all lowercase) ---
if ($json.ConnectionStrings) {
    foreach ($key in $json.ConnectionStrings.PSObject.Properties.Name) {
        $connName = $key.ToLower()
        $ssmParam = "$SSMBasePath$connName"

        try {
            $connValue = (Get-SSMParameter -Name $ssmParam -Region $Region -WithDecryption $true -ErrorAction Stop).Value
            if (-not [string]::IsNullOrWhiteSpace($connValue)) {
                $json.ConnectionStrings.$key = $connValue
                Write-Host "Updated connection string '$connName' with value from SSM ($ssmParam)."
            } else {
                Write-Warning "Value for SSM parameter $ssmParam is null or empty!"
            }
        } catch {
            Write-Warning "SSM parameter $ssmParam not found or error occurred."
        }
    }
}

# Save changes back to appsettings.json (pretty-print for readability)
$json | ConvertTo-Json -Depth 10 | Set-Content $ConfigPath -Encoding UTF8
Write-Host "appsettings.json updated successfully."