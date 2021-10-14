import React from 'react';
import SettingsTable from './SettingsTable';

const TableNumbers = ({ tableNumbers, updateTableNumbers }) => {
    const tables = [...tableNumbers];
    tables.splice(5, 0, 'T0');
    return (
        <>
            {tables.map((tn, index) => {
                return (
                    <div className={tn === 'T0' ? 'col-6 pt-2 pb-2' : 'col-3'} key={index}>
                        {index === 5 ? (
                            <div className="d-flex justify-content-center align-items-center align-content-center" style={{ background: 'grey', height: '100%' }}>
                                <span style={{ fontSize: '2rem', color: 'white' }}>Timer</span>
                            </div>
                        ) : (
                            <SettingsTable
                                tn={tn}
                                update={(table) => {
                                    const realIndex = index >= 5 ? index - 1 : index;
                                    const copy = [...tableNumbers];
                                    copy[realIndex] = table.checked ? table.type + table.number : null;
                                    updateTableNumbers(copy);
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default TableNumbers;
