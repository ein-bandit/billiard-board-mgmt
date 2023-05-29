import React from 'react';

const TimerIntervals = ({ intervals: { timeIntervalToUpdate, timeIntervalSync }, updateIntervals }) => {
    const [activated, setActivated] = React.useState(false);

    return (
        <>
            {!activated && (
                <div className="d-flex w-100 justify-content-center">
                    <button className="btn btn-outline-secondary m-1 p-1" onClick={() => setActivated(true)}>
                        Zeitintervalle bearbeiten
                    </button>
                </div>
            )}
            {activated && (
                <>
                    <div className="form-group col-6">
                        <label>Interval to Update (Standard 1)</label>
                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={timeIntervalToUpdate}
                            onChange={(e) => {
                                updateIntervals({ timeIntervalToUpdate: parseInt(e.target.value) });
                            }}
                        />
                        <small className="form-text text-muted">Aktualisiert alle X Sekunden die Zeit in der Anzeige</small>
                    </div>
                    <div className="form-group col-6">
                        <label>Interval to Sync (Standard 10)</label>
                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={timeIntervalSync}
                            onChange={(e) => {
                                updateIntervals({ timeIntervalSync: parseInt(e.target.value) });
                            }}
                        />
                        <small className="form-text text-muted">Schreibt alle X Sekunden in den Zwischenspeicher</small>
                    </div>
                </>
            )}
        </>
    );
};

export default TimerIntervals;
