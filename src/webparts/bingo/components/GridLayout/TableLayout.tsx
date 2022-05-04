import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import { ThemeSettingName } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useContext } from 'react';
import styles from './TableLayout.module.scss';

export interface ITableLayoutProps {
    items: any[];
    OnClickBingoTile: any;
}
export default class TableLayout extends React.Component<ITableLayoutProps, {}> {

    render(): React.ReactElement<ITableLayoutProps> {
        const { items, OnClickBingoTile } = this.props;
        console.log(items);
        return (
            <div className={ styles.gridLayout }>
                <table className={ styles.tableLayout }>
                    <tbody>
                            {
                                items.map((columnArray) => {
                                    return (
                                        <tr className={ styles.tableRow }>
                                            {
                                                columnArray.map((columnItem) => {
                                                    if (columnItem.title === "BINGO")
                                                    {
                                                        return (
                                                            <td className={ styles.bingoTile } />
                                                        );
                                                    }
                                                    else
                                                    {
                                                        if (columnItem.completed)
                                                        {
                                                            return (
                                                                <td className={ styles.colCompleted } id={ columnItem.position }>{ columnItem.title }</td>
                                                            );
                                                        }
                                                        else
                                                        {
                                                            return (

                                                                <td className={ styles.col } onClick={ e => OnClickBingoTile(columnItem)} id={ columnItem.position }> 
                                                                    {columnItem.title} 
                                                                </td>
                                                            );
 
                                                        }
                                                    }
                                                })
                                            }

                                        </tr>
                                    );
                                })
                            }
                    </tbody>
                </table>
            </div>
                        
        );

    }
}