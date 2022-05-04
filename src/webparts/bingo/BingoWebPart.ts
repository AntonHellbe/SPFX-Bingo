import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BingoWebPartStrings';
import Bingo from './components/Bingo';
import { IBingoProps } from './components/IBingoProps';

export interface IBingoWebPartProps {
  description: string;
}

export default class BingoWebPart extends BaseClientSideWebPart<IBingoWebPartProps> {

  render(): void {
    const element: React.ReactElement<IBingoProps> = React.createElement(
      Bingo,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

}
