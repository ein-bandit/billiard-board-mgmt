import React from 'react';
import Prices from '../components/settings/Prices';
import ReducedPriceSettings from '../components/settings/ReducedPriceSettings';
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
    return (
        <div className="container">
            <form onSubmit={submit}>
                <h2 className="ml-2">Preise</h2>
                <hr />
                <div className="row">
                    <Prices
                        prices={settings.prices}
                        setPrices={(prices) => {
                            setSettings({ ...settings, prices });
                        }}
                    />
                </div>
                <h2 className="ml-2 mt-4">Reduzierte Preise</h2>
                <hr />
                <div className="row">
                    <ReducedPriceSettings
                        reducedSettings={settings.reducedPriceSettings}
                        updateSettings={(reducedPriceSettings) => {
                            console.log('updating rps', reducedPriceSettings);
                            setSettings({ ...settings, reducedPriceSettings });
                        }}
                    />
                </div>
                <div className="row">
                    <button type="submit" className="btn btn-primary" onClick={submit}>
                        Speichern und Zurück
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
