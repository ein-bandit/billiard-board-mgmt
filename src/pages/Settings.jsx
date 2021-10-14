import React from 'react';
import Prices from '../components/settings/Prices';
import ReducedPriceSettings from '../components/settings/ReducedPriceSettings';
import TableNumbers from '../components/settings/TableNumbers';
import TimerIntervals from '../components/settings/TimerIntervals';
import config from '../config';
import { SettingsKey } from '../storage.keys';

const Settings = () => {
    const storage = JSON.parse(localStorage.getItem(SettingsKey)) ?? config;
    const [settings, setSettings] = React.useState(storage);
    const submit = (e) => {
        console.log('save settings to local storage');
        e.preventDefault();
        localStorage.setItem(SettingsKey, JSON.stringify(settings));
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
                <SettingsSubmit classes="w-100 d-flex justify-content-end position-absolute" />

                <h2 className="ml-2">Preise</h2>
                <hr />
                <div className="row m-0">
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
                <hr />
                <SettingsSubmit />
            </form>
        </div>
    );
};

export default Settings;
