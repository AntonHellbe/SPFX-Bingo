import * as React from 'react';
import styles from './Loader.module.scss';

export default class Loader extends React.Component<{}, {}> {


    render(): React.ReactElement
    {
        return (
            <div className={styles.baseLoader}>
                <div className={styles.sectionLoader}>
                    <div className={ styles.spinner }>
                        <div className={ styles.bounce1 }/>
                        <div className={ styles.bounce2 }/>
                        <div className={ styles.bounce3 }/>
                    </div>
                </div>
            </div>
        );
    }
}