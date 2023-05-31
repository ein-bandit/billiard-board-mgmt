import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Settings from './pages/Settings';
import Home from './pages/Home';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { SettingsKey, TableData, VersionKey } from './storage.keys';

import version from './version.json';
import defaultSettings from './defaultSettings.json';

const localVersion = localStorage.getItem(VersionKey);
console.log('local version', localVersion, 'package version', version.version);

if (!localVersion || localVersion !== version.version) {
    console.log(`version is not the same! ${localVersion} in LS, ${version.version} needed. resetting localstorage.`);
    localStorage.setItem(TableData, JSON.stringify({ tables: [], transactions: [] }));
    localStorage.setItem(VersionKey, version.version);
}

const settings = localStorage.getItem(SettingsKey);
if (!settings || !settings.length) {
    localStorage.setItem(SettingsKey, JSON.stringify(defaultSettings));
}

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/settings">
                    <Settings />
                </Route>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
