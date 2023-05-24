import { SettingsKey, TableData } from './storage.keys';

export const getCurrentTables = () => {
    return JSON.parse(localStorage.getItem(TableData) || []);
};

export const saveCurrentTables = (tables) => {
    localStorage.setItem(TableData, JSON.stringify(tables));
};

export const saveSettings = (settings) => {
    localStorage.setItem(SettingsKey, JSON.stringify(settings));
};

export const getSettings = () => {
    return JSON.parse(localStorage.getItem(SettingsKey));
};

export const getReducedPriceDays = () => {
    return getSettings().reducedPriceSettings;
};

export const getReducedPriceDayNames = () => {
    return getReducedPriceDays().map((rps) => rps.day);
};

export const getReducedPriceDay = (day) => {
    console.log('searching', day);
    const x = getReducedPriceDays().find((rps) => rps.day === day);
    console.log('found', x);
    return x;
};

export const getPrices = (type) => {
    return getSettings().prices[type];
};
