import React from 'react';

const SettingsTable = ({ tn, update }) => {
    const table = { checked: tn !== null, type: tn ? tn[0] : '', number: tn ? tn[1] : '' };
    return (
        <div className="card p-2" style={{ opacity: tn === null ? 0.5 : 1 }}>
            <div className="form-group form-check">
                <input
                    type="checkbox"
                    checked={table.checked}
                    className="form-check-input"
                    onChange={(e) => {
                        if (e.target.checked) {
                            update({ checked: true, number: 0, type: 'B' });
                        } else {
                            update({ ...table, checked: false });
                        }
                    }}
                />
                <label className="form-check-label">aktiviert</label>
            </div>
            <div className="form-group row">
                <label className="col-4">Art</label>
                <div className="col-8">
                    <select
                        className="form-control"
                        value={table.type}
                        onChange={(e) => {
                            update({ ...table, type: e.target.value });
                        }}
                    >
                        <option value=""></option>
                        <option value="B">Billard</option>
                        <option value="D">Dart</option>
                    </select>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-4">Tisch</label>
                <div className="col-8">
                    <input
                        type="number"
                        className="form-control"
                        value={table.number}
                        min={0}
                        onChange={(e) => {
                            // TODO: check if number
                            update({ ...table, number: e.target.value });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsTable;
