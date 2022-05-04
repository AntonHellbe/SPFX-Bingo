# Get-PnPApp #list all apps
$bingo = Get-PnPApp -Identity "731ce78d-fe3a-4cfb-8a09-2de1b1419367"
Install-PnPApp $bingo.Id