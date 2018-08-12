import React from 'react';
import {render} from 'react-dom';
import TableManager from './TableManager';
import bmConfig from './default-config.js'

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

let config = window.bmConfig;
if (config === undefined) {
    console.log("no existing config, loading default config");
    config = bmConfig.bmConfig;
}
const settings = config;

const App = () => {
    return (<div style={styles}>
        <TableManager tables={settings.numberOfTables} interval={settings.timeIntervalToUpdate}
                      syncInterval={settings.timeIntervalSync} price={settings.pricePerHour / 60 / 60}
                      reactivateEnabled={settings.reactivateEnabled} tableNumbers={settings.tableNumbers}
                      priceSumByHours={settings.priceSumByHours}/>
    </div>)
};


render(<App/>, document.getElementById('root'));
