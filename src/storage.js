import { SettingsKey, TableData } from './storage.keys';

export const getCurrentTables = () => {
    return JSON.parse(localStorage.getItem(TableData) || []);
};

// is called whenever sync interval is reached
export const saveCurrentTables = (tables) => {
    localStorage.setItem(TableData, JSON.stringify(tables));
};

let LOCAL_SETTINGS = null;

export const saveSettings = (settings) => {
    localStorage.setItem(SettingsKey, JSON.stringify(settings));
    LOCAL_SETTINGS = settings;
};

export const getSettings = () => {
    if (LOCAL_SETTINGS === null) {
        LOCAL_SETTINGS = JSON.parse(localStorage.getItem(SettingsKey));
    }
    return LOCAL_SETTINGS;
};

export const getReducedPriceDays = () => {
    return getSettings().reducedPriceSettings;
};

export const getReducedPriceDayNames = () => {
    return getReducedPriceDays().map((rps) => rps.day);
};

export const getReducedPriceDay = (day) => {
    return getReducedPriceDays().find((rps) => rps.day === day);
};

export const getPrices = (type) => {
    return getSettings().prices[type];
};
