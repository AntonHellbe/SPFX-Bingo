import { TileTranslation, USERLIST, BINGOLIST } from '../constants/constants';
import { IBingoTile } from '../components/IBingoProps';


function createNewBoard(): any[] {
    let emptyBoard = [];
    for(let i = 0; i < 5; i++)
    {
        emptyBoard[i] = new Array(5);
    }

    return emptyBoard;
}

export function fillBoardFromArray(tiles: any[]): IBingoTile[]
{
    let emptyBoard = createNewBoard();
    let bingoTileIndex = 0;

    for(let i = 0; i < 5; i++)
    {
        for(let j = 0; j < 5; j++)
        {
            if (i === 2 && j === 2)
            {
                //addBingoTile(emptyBoard);
                //emptyBoard[2][2] = { title: "BINGO", tileId: "", };
            }
            else
            {
                // Fill the bingo board
                let bingoTileTitle = tiles[bingoTileIndex].Title;
                let bingoTileId = tiles[bingoTileIndex].Id;
                let bingoTilePosition = i + "," + j;
                emptyBoard[i][j] = {
                    title: bingoTileTitle,
                    tileId: bingoTileId,
                    position: bingoTilePosition,
                    completed: false
                };
                bingoTileIndex++;

            }
        }
    }

    emptyBoard = addBingoTile(emptyBoard);

    return emptyBoard;
}

export function createSavedBoard(bingoBoard: IBingoTile[]) : any 
{
    let savedBoard = {};
    let bingoTilesString = "";
    for (let i = 0; i < 5; i++)
    {
        for (let j = 0; j < 5; j++)
        {
            let tile = bingoBoard[i][j];
            if (tile.tileId !== "")
            {
                savedBoard[TileTranslation[tile.tileId]] = tile.position;
                bingoTilesString += tile.tileId + ",";
            }
        }
    }
    savedBoard["BingoTiles"] = bingoTilesString;
    return savedBoard;
}

export function checkForRowCompleted(tileY: number, tileX: number, bingoBoard: any[]) : boolean
{
    for(let i = 0; i < 5; i++)
    {
        if (!bingoBoard[tileY][i].completed)
        {
           return false;
        }
    }

    return true;
}

export function checkForColumnCompleted(tileY: number, tileX: number, bingoBoard: any[])
{
    for (let i = 0; i < 5; i++)
    {
        if(!bingoBoard[i][tileX].completed)
        {
            return false;
        }
    }
    return true;
}

export function checkForBoardCompleted(bingoBoard: IBingoTile[])
{
    for(let i = 0; i < 5; i++)
    {
        for (let j = 0; j < 5; j++)
        {
            if (!bingoBoard[i][j].completed)
            {
                return false;
            }
        }
    }
    return true;
}


function addBingoTile(bingoBoard: IBingoTile[]) : IBingoTile[]
{
    let bingoBoardCopy = [ ...bingoBoard ];
    bingoBoardCopy[2][2] = {
        title: "BINGO",
        tileId: "",
        position: "2,2",
        completed: true
    };
    return bingoBoardCopy;
}

export async function fillFromSavedBoard(sp: any, savedBoard: any) : Promise<IBingoTile[]>
{
    let emptyBoard = createNewBoard();
    let bingoTile;
    let completedTiles = null;

    // Remove trailing comma and split the IDs of the tiles used
    let bingoTiles = savedBoard.BingoTiles.slice(0, -1).split(",");
    if (savedBoard.TilesCompleted !== null)
    {
        completedTiles = savedBoard.TilesCompleted.slice(0, -1).split(",");
        for (let i = 0; i < completedTiles.length; i++)
        {
            completedTiles[i] = Number(completedTiles[i]);
        }
    }

    for (let i = 0; i < bingoTiles.length; i++)
    {
        let isTiledCompleted = false;
        let tileId = Number(bingoTiles[i]);
        let tilePosition = savedBoard[TileTranslation[tileId]].split(",");
        let tileX = Number(tilePosition[0]);
        let tileY = Number(tilePosition[1]);
        bingoTile = await sp.web.lists.getByTitle(BINGOLIST).items.getById(tileId).get();
        if (completedTiles !== null)
        {
            if(completedTiles.includes(tileId))
            {
                isTiledCompleted = true;
            }

        }
        emptyBoard[tileX][tileY] = { 
            title: bingoTile.Title,
            tileId: tileId, 
            position: tileX + "," + tileY,
            completed: isTiledCompleted 
        };
    }
    emptyBoard = addBingoTile(emptyBoard);
    return emptyBoard;
}
