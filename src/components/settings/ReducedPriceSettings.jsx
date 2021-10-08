import React from 'react';

const _WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const ReducedPriceSettings = ({ days, times, update }) => {
    console.log(days, times);
    const [weekdays, setWeekdays] = React.useState(
        _WEEKDAYS.map((w) => {
            console.log(w, days.includes(w));
            return {
                name: w,
                checked: days.includes(w),
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
                                update({ reducedPricedDays: arr });
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
