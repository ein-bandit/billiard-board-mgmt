import React from 'react';
import {render} from 'react-dom';
import TableManager from './TableManager';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center'
};

const App = () => {
    return (<div style={styles}>
        <TableManager />
    </div>)
};


render(<App/>, document.getElementById('root'));
