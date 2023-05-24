import React from 'react';
import Prices from '../components/settings/Prices';
import ReducedPriceSettings from '../components/settings/ReducedPriceSettings';
import TableNumbers from '../components/settings/TableNumbers';
import TimerIntervals from '../components/settings/TimerIntervals';
import { SettingsKey } from '../storage.keys';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { Link } from 'react-router-dom';
import defaultSettings from '../defaultSettings';

import { saveSettings } from '../storage';

const Settings = () => {
    const storage = JSON.parse(localStorage.getItem(SettingsKey)) ?? defaultSettings;
    const [settings, setSettings] = React.useState(storage);

    const history = useHistory();
    const submit = (e) => {
        e.preventDefault();
        console.log('save settings to local storage');
        saveSettings(settings);
        history.push('/');
    };

    const ButtonRow = () => {
        return (
            <div className="mt-3 d-flex justify-content-end align-items-center">
                <div className="pr-3">
                    <Link to="/">zurück zur Übersicht</Link>
                </div>
                <SettingsSubmit />
            </div>
        );
    };

    const SettingsSubmit = ({ classes }) => {
        return (
            <div className={`row m-0 ${classes}`}>
                <button type="submit" className="btn btn-primary p-1 pl-2 pr-2" onClick={submit}>
                    Speichern und Zurück
                </button>
            </div>
        );
    };

    return (
        <div className="container">
            <form className="position-relative" onSubmit={submit}>
                <ButtonRow />
                <h2 className="ml-2">Preise</h2>
                <hr />

                <div className="row m-0">
                    <p className="mb-3 ml-1" style={{ fontSize: '0.8rem' }}>
                        Preisangaben in Euro pro Stunde. Reduzierter Preis gilt in den unten angegebenen Zeitspannen.
                    </p>
                    <Prices
                        prices={settings.prices}
                        setPrices={(prices) => {
                            setSettings({ ...settings, prices });
                        }}
                    />
                </div>
                <h2 className="ml-2 mt-4">Reduzierte Preise</h2>
                <hr />
                <div className="row m-0">
                    <ReducedPriceSettings
                        reducedSettings={settings.reducedPriceSettings}
                        updateSettings={(reducedPriceSettings) => {
                            console.log('updating rps', reducedPriceSettings);
                            setSettings({ ...settings, reducedPriceSettings });
                        }}
                    />
                </div>
                <h2 className="ml-2 mt-4">Tischnummern</h2>
                <hr />
                <div className="row">
                    <TableNumbers
                        tableNumbers={settings.tableNumbers}
                        updateTableNumbers={(tableNumbers) => {
                            setSettings({ ...settings, tableNumbers });
                        }}
                    />
                </div>
                <hr />
                <h2 className="ml-2 mt-4">Debug</h2>
                <hr />
                <div className="row m-0">
                    <TimerIntervals
                        intervals={{ timeIntervalToUpdate: settings.timeIntervalToUpdate, timeIntervalSync: settings.timeIntervalSync }}
                        updateIntervals={(intervals) => {
                            setSettings({ ...settings, ...intervals });
                        }}
                    />
                </div>
                <div className="mb-3">
                    <ButtonRow />
                </div>
            </form>
        </div>
    );
};

export default Settings;
