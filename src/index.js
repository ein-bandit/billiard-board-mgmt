import React from 'react';
import ReactDOM from 'react-dom';
import TableManager from './TableManager';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Settings from './pages/Settings';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Link to="/settings">settings</Link>
            <Switch>
                <Route exact path="/">
                    <TableManager />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
