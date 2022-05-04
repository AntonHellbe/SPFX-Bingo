# bingo-webpart

## Summary

-


## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.11-green.svg)


## Getting started

**Deploy lists**

1. Deploy the lists to the site which you're going to use the WebPart on.
2. PnP Templates for the lists are included in the ```spo``` folder

**Launch WebPart**

1. Clone the repository
2. Install the dependencies: ```npm install```
3. Run the Web Part: ```gulp serve```
4. Open the workbench on a test site, example: ```https://devdomainer.sharepoint.com/sites/anton-test-site/_layouts/15/workbench.aspx```
5. Add the WebPart


## Solution

"Back-end" consists of two lists:

* BingoList: Holds the tiles that are using in the bingo board
* UserList: User information is stored in this list. Which rows the user has completed, which tiles are clicked etc

"Front-end":

* SPFX WebPart
* React
* HTML Table styled using SCSS

**Front end image**
<div align="center">
	<img src="/images/bingo-example.png" />
</div>

## Known Issues

* Layout not suitable mobile phones
    * Only work in landscape mode on mobile phones
* Loading issues (Not confirmed if its an issue with the WebPart)
    * Press F5 to reload and it works


