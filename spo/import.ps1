# if legacy pnp, use -UseWebLogin
Connect-PnPOnline -Url https://skanska.sharepoint.com/sites/se-collaboration -Interactive

# if legacy pnp, use Apply-PnPProvisioningTemplate
Invoke-PnPSiteTemplate -Path .\pnp_bingolist.xml
Invoke-PnPSiteTemplate -Path .\pnp_userlist.xml

$questions = Import-Csv -Path ".\pnp_questions.csv" -Encoding UTF8
$questions | ForEach-Object {
    $val = @{Title = $_.Title }
    Add-PnPListItem -List "BingoList" -Values $val
}
