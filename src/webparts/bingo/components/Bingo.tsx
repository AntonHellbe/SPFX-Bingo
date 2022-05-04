import * as React from 'react';
import styles from './Bingo.module.scss';
import { IBingoProps, IBingoState, IBingoTile } from './IBingoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import TableLayout from './TableLayout/TableLayout';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import { IItemAddResult, Item } from "@pnp/sp/items";
import { 
    fillBoardFromArray,
    createSavedBoard,
    fillFromSavedBoard,
    checkForRowCompleted,
    checkForColumnCompleted,
    checkForBoardCompleted
} from '../helpers/BingoBoard';
import {
    BINGOLIST,
    USERLIST
} from '../constants/constants';
import { BingoModal } from './BingoModal/BingoModal';
import Loader from './Loader/Loader';

export default class Bingo extends React.Component<IBingoProps, IBingoState> {

    constructor(props: IBingoProps)
    {
        super(props);
        sp.setup({
            spfxContext: this.props.context
        });

        //Initialize Empty State
        this.state = {
            bingoTiles: [],
            currentUser: "",
            bingo: false,
            isModalOpen: false
        };
        this.onClickTile.bind(this);
    }

    componentDidMount() 
    {
        this.ConfigureBoardForUser();
    }

    private async SaveBoardToUser(userId: number, bingoBoard: IBingoTile[])
    {
        let list = sp.web.lists.getByTitle(USERLIST);
        let savedBoard = createSavedBoard(bingoBoard); 
        try
        {   
            const i = await list.items.getById(userId).update(savedBoard);
        }
        catch (error)
        {
            console.log("Error happend", error);
        }
    }

    private async GetNewBingoBoard(userId: number): Promise<IBingoTile[]>
    {
        let bingoTiles = await sp.web.lists.getByTitle(BINGOLIST).items.getPaged();
        let filledBingoBoard = fillBoardFromArray(bingoTiles.results);

        return filledBingoBoard;
    }

    private async GetExistingBingoBoard(userId: number): Promise<IBingoTile[]>
    {
        //let emptyBingoBoard = this.CreateEmptyBingoBoard();
        let savedBoard = await sp.web.lists.getByTitle(USERLIST).items.getById(userId).get();
        console.log(savedBoard);
        // Fill the empty board with tiles
        let bingoBoard = await fillFromSavedBoard(sp, savedBoard);
        
        return bingoBoard;
    }

    private async GetUser()
    {
        let currentUser = await sp.web.currentUser.get();
        return currentUser;
    }

    private async ConfigureBoardForUser ()
    {
        let userListItem = null;
        let filledBingoBoard;
        let currentUser = await this.GetUser();
        try
        {
            userListItem = await sp.web.lists.getByTitle(USERLIST).items.getById(currentUser.Id).get();
        }
        catch (error)
        {
                console.error("Exception thrown", error);
        }
        console.log("Current User UPN: " + currentUser.UserPrincipalName);
        console.log("Current User ID: " + currentUser.Id.toString());
        console.log("------------------------------------------------");
        
        if (userListItem === null)
        {
            console.log("Creating entry in UserList for user: " + currentUser.UserPrincipalName);
            const iar:  IItemAddResult = await sp.web.lists.getByTitle(USERLIST).items.add({
                UserId: currentUser.UserPrincipalName,
                ID: currentUser.Id,
                Id: currentUser.Id
            });

            filledBingoBoard = await this.GetNewBingoBoard(currentUser.Id);
            this.SaveBoardToUser(currentUser.Id, filledBingoBoard);
        }
        else
        {
            filledBingoBoard = await this.GetExistingBingoBoard(currentUser.Id);
        }

        this.setState({ bingoTiles: filledBingoBoard, currentUser: currentUser });
    }

    private async updateSavedState(tileId: number, rowCompleted:string = null)
    {
        const { Id } = this.state.currentUser;
        let userList = sp.web.lists.getByTitle(USERLIST);
        let savedState = await userList.items.getById(Id).select("RowsCompleted", "TilesCompleted").get();
        let updatedRowsCompleted = null;
        if (rowCompleted !== null)
        {
            updatedRowsCompleted = savedState.RowsCompleted === null ? [ rowCompleted ] : [ ...savedState.RowsCompleted,  rowCompleted ];
        }
        let completedList = savedState.TilesCompleted;

        // Have the user completed any tiles? If not, TilesCompleted will be null
        completedList === null ? completedList = tileId + "," : completedList += tileId + ",";

        if (updatedRowsCompleted === null)
        {
            userList.items.getById(Id).update({ TilesCompleted: completedList });
        }
        else
        {
            userList.items.getById(Id).update({ TilesCompleted: completedList, RowsCompleted: { results: updatedRowsCompleted } });
        }

    }

    onClickTile = (tile) => 
    {
        console.log(tile);
        let tilePosition = tile.position.split(",");
        const tileY = Number(tilePosition[0]);
        const tileX = Number(tilePosition[1]);

        // Copy bingoboard in order to set new state
        let bingoBoardCopy = [...this.state.bingoTiles ];
        bingoBoardCopy[tileY][tileX] = { 
            title: tile.title,
            tileId: tile.tileId, 
            position: tileY + "," + tileX, 
            completed: true 
        };

        // Save the completed tile to the UserList
        //this.SaveCompletedTileToUser(tile.tileId);
        // Save the completed tile to state to trigger refresh of UI
        //this.SaveCompletedTileToState(bingoBoardCopy);
        this.setState({ bingoTiles: bingoBoardCopy });

        const rowCompleted = checkForRowCompleted(tileY, tileX, this.state.bingoTiles);


        if(rowCompleted)
        {
            const boardCompleted = checkForBoardCompleted(this.state.bingoTiles);
            if (boardCompleted)
            {
                this.showModal();
            }
            //this.SaveRowCompletedToUser(tileY);
            let row = "Rad " + (tileY + 1);
            this.updateSavedState(tile.tileId, row);
        }
        else
        {
            this.updateSavedState(tile.tileId);

        }

        console.log("Is a row completed with this tile: " + rowCompleted);
    }

    showModal = () => {
        this.setState({ isModalOpen: true });
    }

    hideModal = () => {
        this.setState({ isModalOpen: false });
    }

    render(): React.ReactElement<IBingoProps> 
    {
      const { bingoTiles } = this.state;
      if (bingoTiles.length === 0)
      {
        return (
          <Loader />
        );

      }
      else
      {
        return (
            <div className={ styles.bingo }>
                <div className={ styles.container }>
                    <BingoModal isModalOpen={ this.state.isModalOpen } showModal={ this.showModal } hideModal={ this.hideModal } />
                    <TableLayout items={ this.state.bingoTiles } OnClickBingoTile={ this.onClickTile } />
                </div>
            </div>
        );
      }
    }
}
