import React from 'react';

const _WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const ReducedPriceSettings = ({ reducedSettings, setReducedSettings }) => {
    const [weekdays, setWeekdays] = React.useState(
        _WEEKDAYS.map((weekday) => {
            return {
                name: weekday,
                checked: reducedSettings.reducedPriceDays.includes(weekday),
            };
        })
    );
    return (
        <div className="row mx-auto">
            {weekdays.map((weekday, index) => {
                return (
                    <div className="form-check form-check-inline" key={index}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`weekday-${index}`}
                            checked={weekday.checked}
                            onChange={(e) => {
                                console.log('chosen', weekday, weekday.checked);
                                const arr = [...weekdays];
                                arr[index].checked = e.target.checked;
                                setWeekdays(arr);
                                setReducedSettings({ ...reducedSettings, reducedPriceDays: arr.filter((w) => w.checked).map((w) => w.name) });
                            }}
                        />
                        <label className="form-check-label">{weekday.name}</label>
                    </div>
                );
            })}
        </div>
    );
};

export default ReducedPriceSettings;
