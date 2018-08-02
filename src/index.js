import React from 'react';
import {render} from 'react-dom';
import TableManager from './TableManager';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

const settings = {
    numberOfTables: 4,
    timeIntervalToUpdate: 1,
    pricePerSecond: 14 / 100 / 60
};

const App = () => {
    return (<div style={styles}>
        <h1>Your Billiard Board Manager!</h1>
        <TableManager tables={settings.numberOfTables} interval={settings.timeIntervalToUpdate}
                      price={settings.pricePerSecond} />
    </div>)
}


render(<App/>, document.getElementById('root'));
