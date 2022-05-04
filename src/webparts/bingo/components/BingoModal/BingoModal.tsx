import * as React from 'react';
import styles from './BingoModal.module.scss';
import { useId, useBoolean } from '@uifabric/react-hooks';
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  DefaultButton,
  Modal,
  IDragOptions,
  IconButton,
  IIconProps,
} from 'office-ui-fabric-react';

const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };

export interface IBingoModalProps {
  isModalOpen: boolean;
  showModal: Function;
  hideModal: Function;
}

export class BingoModal extends React.Component <IBingoModalProps, {}>
{

  private configureContentStyles() : any
  {
    const theme = getTheme();
    const contentStyles = mergeStyleSets({
      container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        overflowY: 'hidden',
        overflowX: 'hidden',
        minWidth: '500px'
      },
      header: [
        // eslint-disable-next-line deprecation/deprecation
        theme.fonts.xLargePlus,
        {
          flex: '1 1 auto',
          borderTop: `4px solid ${theme.palette.themePrimary}`,
          color: theme.palette.neutralPrimary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: FontWeights.semibold,
          padding: '12px 12px 14px 24px',
        },
      ],
      body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
        width: '500px',
        height: '300px'
      },
    });
    return contentStyles;
  }

  private configureIconButtonStyle() : any {

    const theme = getTheme();
    const iconButtonStyles = {
      root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
      },
      rootHovered: {
        color: theme.palette.neutralDark,
      },
    };
    return iconButtonStyles;
  } 

  render() : React.ReactElement {
    const { showModal, hideModal, isModalOpen } = this.props;

    const theme = getTheme();
    const contentStyles = this.configureContentStyles();
    const iconButtonStyles = this.configureIconButtonStyle(); 
    //const titleId = useId('title');
    return (
      <div>
            <Modal
                titleAriaId={"123"}
                isOpen={isModalOpen}
                onDismiss={ () => hideModal()}
                isBlocking={false}
                containerClassName={contentStyles.container}
                dragOptions={ undefined }
                className={ styles.modalLayout }
            >
                <div className={contentStyles.header}>
                    <span className={ styles.title }>GRATTIS!</span>
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={ () => hideModal() }
                        />
                    </div>
                <div className={contentStyles.body}>
                  <div id="confettis">
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                    <div className={ styles.confetti }></div>
                  </div>
                  <p className={ styles.modalText }>Ni har nu fått bingo. Glöm inte att ladda upp foton och filmer i kanalen Bildflöde i Teams</p>
                </div>
            </Modal>
          </div>
    );
  }

}