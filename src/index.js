import React from 'react';
import {render} from 'react-dom';
import TableManager from './TableManager';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

const settings = window.config;

const App = () => {
    return (<div style={styles}>
        <TableManager tables={settings.numberOfTables} interval={settings.timeIntervalToUpdate}
                      price={settings.pricePerSecond / 100 / 60} reactivateEnabled={settings.reactivateEnabled}
                      tableNumbers={settings.tableNumbers}/>
    </div>)
}


render(<App/>, document.getElementById('root'));
