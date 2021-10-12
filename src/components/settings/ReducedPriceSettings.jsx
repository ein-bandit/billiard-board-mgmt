import React from 'react';
import TimeInput from './TimeInput';

const _WEEKDAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const ReducedPriceSettings = ({ reducedSettings, updateSettings }) => {
    return (
        <div className="row">
            <ul className="list-group" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                {reducedSettings.map((setting, index) => {
                    return (
                        <li className="list-group-item" key={index}>
                            <div className="d-flex">
                                <div className="d-flex align-items-center">
                                    <button type="button" className="btn btn-outline-secondary">
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                                <div className="col d-flex align-items-center" key={index}>
                                    <select
                                        value={setting.day}
                                        onChange={(e) => {
                                            const copy = { ...setting, day: e.target.value };
                                            const settingsCopy = [...reducedSettings];
                                            settingsCopy[index] = copy;
                                            updateSettings(settingsCopy);
                                        }}
                                    >
                                        {_WEEKDAYS.map((w, i) => {
                                            return <option key={i}>{w}</option>;
                                        })}
                                    </select>
                                </div>
                                {setting.times.map((time, timeIndex) => {
                                    return (
                                        <TimeInput
                                            key={timeIndex}
                                            time={time}
                                            updateTime={(update) => {
                                                const copy = { ...setting };
                                                copy.times[timeIndex] = update;
                                                console.log(copy);
                                                const settingsCopy = [...reducedSettings];
                                                settingsCopy[index] = copy;
                                                updateSettings(settingsCopy);
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </li>
                    );
                })}
                <li className="list-group-item">
                    <div className="d-flex align-items-center">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                updateSettings([...reducedSettings].concat([{ day: _WEEKDAYS[0], times: ['00:00', '00:00'] }]));
                            }}
                        >
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ReducedPriceSettings;
