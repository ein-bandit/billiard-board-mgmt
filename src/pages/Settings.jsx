import React from 'react';
import PriceCard from '../components/settings/PriceCard';
import ReducedPriceSettings from '../components/settings/ReducedPriceSettings';
import config from '../config';

const Settings = () => {
    const [settings, setSettings] = React.useState({ ...config });
    const submit = (e) => {
        console.log('save settings to local storage');
        e.preventDefault();
    };
    return (
        <div className="container">
            <form onSubmit={submit}>
                <h2 className="ml-2">Preise</h2>
                <hr />
                <div className="row">
                    {Object.keys(settings.prices).map((key, index) => {
                        return (
                            <div className="col-6" key={index}>
                                <PriceCard
                                    type={key}
                                    key={index}
                                    prices={settings.prices[key]}
                                    setPrices={(type, prices) => {
                                        const update = { ...settings.prices, [type]: prices };
                                        setSettings({ ...settings, prices: update });
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <h2 className="ml-2 mt-4">Reduzierte Preise</h2>
                <hr />
                <div className="row">
                    <ReducedPriceSettings
                        days={settings.reducedPriceDays}
                        times={[settings.reducedPriceTimeStart, settings.reducedPriceTimeEnd]}
                        update={(priceSettings) => {
                            setSettings({ ...settings, ...priceSettings });
                        }}
                    />
                </div>
                <div className="row">
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
