import _ from 'lodash';
import { WEEKDAYS } from './globals';
import { getPrices, getReducedPriceDay, getReducedPriceDayNames } from './storage';

export function GetTimeString(time) {
    let allTime = (time.active + time.reduced) / 1000;
    return GetTimeStringFromSeconds(allTime);
}

export function GetTimeStringSplitted(time) {
    return GetTimeStringFromSeconds(time.active) + time.reduced > 0 ? ' (reduziert:' + GetTimeStringFromSeconds(time.reduced) + ')' : '';
}

export function GetTimeStringFromSeconds(totalSeconds) {
    var sec_num = parseInt(totalSeconds, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - hours * 3600) / 60);
    var seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

export function GetTimeStringFromDate(date) {
    if (!date) {
        return '';
    }
    var tempDate = new Date(date);

    function checkTime(i) {
        return i < 10 ? '0' + i : i;
    }

    var h = checkTime(tempDate.getHours());
    var m = checkTime(tempDate.getMinutes());
    var s = checkTime(tempDate.getSeconds());

    return h + ':' + m + ':' + s;
}

/**
 * Takes a timeActive object which includes active and reduced prices.
 * @param {*} timeActive
 */
export function GetPrice(timeActive, type) {
    if (type === undefined) throw new Error('No type for table. Could not get price');
    return GetPriceActive(timeActive.active, type) + GetPriceReduced(timeActive.reduced, type);
}

function GetPriceActive(time, type) {
    if (time === 0) return 0;
    const pricePerHour = getPrices(type).price;
    return (pricePerHour / 60 / 60 / 1000) * time;
}

function GetPriceReduced(time, type) {
    if (time === 0) return 0;
    const reducedPricePerHour = getPrices(type).reduced;
    return (reducedPricePerHour / 60 / 60 / 1000) * time;
}

export function GetFormattedPrice(time, type) {
    return (Math.round(GetPrice(time, type) * 100) / 100).toFixed(2).replace('.', ',');
}

export function GetFormattedPriceSplitted(time, type) {
    //GetPrice * 100 / 100 may return NaN -> return 0 as fallback.
    let activePrice = Math.round(GetPriceActive(time.active, type) * 100) / 100 || 0;
    let reducedPrice = Math.round(GetPriceReduced(time.reduced, type) * 100) / 100 || 0;

    let activePriceString = activePrice.toFixed(2).replace('.', ',');
    let reducedPriceString = reducedPrice.toFixed(2).replace('.', ',');

    return activePriceString + ' + ' + reducedPriceString + ' = ' + (activePrice + reducedPrice).toFixed(2).toString().replace('.', ',');
}

/**
 * Returns an object with the active time and reduced active time in seconds from a given startdate.
 * @param {date when table was started} startDate
 */
export function GetTimeActive(startDateMillis) {
    let reduced = 0;
    let now = Date.now();
    let startDate = new Date(startDateMillis);
    let day = WEEKDAYS[startDate.getDay()];
    //is reduced price applicable by day?
    if (_.includes(getReducedPriceDayNames(), day)) {
        //console.log("it is a reduced day, we may need to calc reduced time");

        const reducedPriceDay = getReducedPriceDay(day);

        const reducedDayStart = reducedPriceDay.times[0];
        const reducedDayEnd = reducedPriceDay.times[1];

        let reducedStart = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            parseInt(reducedDayStart.split(':')[0], 10),
            parseInt(reducedDayStart.split(':')[1], 10),
            0
        );

        let reducedEnd = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            parseInt(reducedDayEnd.split(':')[0], 10),
            parseInt(reducedDayEnd.split(':')[1], 10),
            59
        );

        //only calc reduced if we already are in happy hour(s).
        if (now > reducedStart) {
            if (startDate < reducedStart) {
                //if start is before reduced time -> reduced up to now or end
                if (now < reducedEnd) {
                    reduced = now - reducedStart;
                } else {
                    reduced = reducedEnd - reducedStart;
                }
            } else if (startDate < reducedEnd) {
                if (now < reducedEnd) {
                    reduced = now - startDate;
                } else {
                    reduced = reducedEnd - startDate;
                }
            }
        }

        //console.log("reduced time in milliseconds is", reduced);
        //console.log("in minutes", reduced / 1000 / 60);
    }

    return { active: now - startDate - reduced, reduced: reduced };
}

export function IsReducedPrice() {
    let now = Date.now();
    let day = WEEKDAYS[now.getDay()];
    //console.log(now, day, time);

    if (!_.includes(getReducedPriceDayNames(), day)) {
        // console.log("is reduced price day?", day, false);
        return false;
    }

    const reducedPriceDay = getReducedPriceDay(day);

    const reducedDayStart = reducedPriceDay.times[0];
    const reducedDayEnd = reducedPriceDay.times[1];

    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(reducedDayStart.split(':')[0], 10), parseInt(reducedDayStart.split(':')[1], 10), 0);
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(reducedDayEnd.split(':')[0], 10), parseInt(reducedDayEnd.split(':')[1], 10), 0);

    //console.log("is reduced price? "time: ", start <= now && end >= now);

    return start <= now && end >= now;
}
