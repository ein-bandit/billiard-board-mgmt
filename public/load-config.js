(function() {
    let config = require('electron').remote.getGlobal('bmConfig');
    if (config) {
        window.bmConfig = {
            "timeIntervalToUpdate": config.timeIntervalToUpdate,
            "timeIntervalSync": config.timeIntervalSync,
            "pricePerHour": config.pricePerHour,
            "reactivateEnabled": config.reactivateEnabled,
            "tableNumbers": config.tableNumbers
        };
    }
})();