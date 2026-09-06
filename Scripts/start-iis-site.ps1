$siteName = "EmployerNext"
$appPoolName = "AppPool_EmployerNext"  # Use your real app pool name if different

& "$env:SystemRoot\System32\inetsrv\appcmd.exe" start apppool /apppool.name:"$appPoolName"
& "$env:SystemRoot\System32\inetsrv\appcmd.exe" start site /site.name:"$siteName"
