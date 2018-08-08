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
                      syncInterval={settings.timeIntervalSync} price={settings.pricePerHour / 60 / 60}
                      reactivateEnabled={settings.reactivateEnabled} tableNumbers={settings.tableNumbers}/>
    </div>)
};


render(<App/>, document.getElementById('root'));
