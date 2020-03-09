import config from './config';
import _ from 'lodash';

export function GetTimeString(time) {
    let allTime = (time.active + time.reduced) / 1000;
    return GetTimeStringFromSeconds(allTime);
}

export function GetTimeStringSplitted(time) {
    return GetTimeStringFromSeconds(time.active) +
        time.reduced > 0 ? ' (reduziert:' + GetTimeStringFromSeconds(time.reduced) + ')' : '';
}

export function GetTimeStringFromSeconds(totalSeconds) {
    var sec_num = parseInt(totalSeconds, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

export function GetTimeStringFromDate(date) {
    if (!date) {
        return '';
    }
    var tempDate = new Date(date);

    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

    var h = checkTime(tempDate.getHours());
    var m = checkTime(tempDate.getMinutes());
    var s = checkTime(tempDate.getSeconds());

    return h + ":" + m + ":" + s;
}

/**
 * Takes a timeActive object which includes active and reduced prices.
 * @param {*} timeActive 
 */
export function GetPrice(timeActive) {
    return GetPriceActive(timeActive.active) + GetPriceReduced(timeActive.reduced);
}

function GetPriceActive(time) {
    if (time === 0) return 0;
    return (config.pricePerHour / 60 / 60 / 1000) * time;
}

function GetPriceReduced(time) {
    if (time === 0) return 0;
    return (config.reducedPricePerHour / 60 / 60 / 1000) * time;
}

export function GetFormattedPrice(time) {
    return (Math.round(GetPrice(time) * 100) / 100).toFixed(2).replace('.', ',')
}

export function GetFormattedPriceSplitted(time) {
    //GetPrice * 100 / 100 may return NaN -> return 0 as fallback.
    let activePrice = (Math.round((GetPriceActive(time.active) * 100)) / 100 || 0);
    let reducedPrice = (Math.round((GetPriceReduced(time.reduced) * 100)) / 100 || 0);

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
    let startDate = new Date(startDateMillis)
    let day = weekdays[startDate.getDay()];
    //is reduced price applicable by day?
    if (_.includes(config.reducedPriceDays, day)) {
        //console.log("it is a reduced day, we may need to calc reduced time");

        let reducedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
            parseInt(config.reducedPriceTimeStart.split(":")[0], 10),
            parseInt(config.reducedPriceTimeStart.split(":")[1], 10),
            parseInt(config.reducedPriceTimeStart.split(":")[2], 10));

        let reducedEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
            parseInt(config.reducedPriceTimeEnd.split(":")[0], 10),
            parseInt(config.reducedPriceTimeEnd.split(":")[1], 10),
            parseInt(config.reducedPriceTimeEnd.split(":")[2], 10));

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

        //console.log("reduced time in milliseconds is", reduced);
        //console.log("in minutes", reduced / 1000 / 60);
    }

    return { active: (now - startDate) - reduced, reduced: reduced };
}

const weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

export function IsReducedPrice() {
    let now = Date.now();
    let day = weekdays[now.getDay()];
    //console.log(now, day, time);

    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
        parseInt(config.reducedPriceTimeStart.split(":")[0], 10),
        parseInt(config.reducedPriceTimeStart.split(":")[1], 10),
        parseInt(config.reducedPriceTimeStart.split(":")[2], 10));
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
        parseInt(config.reducedPriceTimeEnd.split(":")[0], 10),
        parseInt(config.reducedPriceTimeEnd.split(":")[1], 10),
        parseInt(config.reducedPriceTimeEnd.split(":")[2], 10));

    //console.log("is reduced price? day:", _.includes(config.reducedPriceDays, day), "time: ", start <= now && end >= now);

    return _.includes(config.reducedPriceDays, day) && (start <= now && end >= now);
}