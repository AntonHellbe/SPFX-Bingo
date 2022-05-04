# if legacy use -UseWebLogin instead of -Interactive
Connect-PnPOnline -Url https://skanska.sharepoint.com/sites/se-collaboration-staging -Interactive #-UseWebLogin
cd spo
# if legacy pnp use Export-PnPListToProvisioningTemplate
Export-PnPListToSiteTemplate -Out .\pnp_bingolist.xml -List "BingoList"
Export-PnPListToSiteTemplate -Out pnp_userlist.xml -List "UserList"


$items = Get-PnPListItem -List "BingoList"
$questions = $items | ForEach-Object {
    [PSCustomObject]@{
        Title = $_["Title"]
    } 
}
$questions | Export-Csv -Path "pnp_questions.csv" -NoTypeInformation -Encoding UTF8
Disconnect-PnPOnline