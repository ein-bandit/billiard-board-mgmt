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