import React from 'react';
import Table from './Table';
import Timer from './Timer';
import TableHistoryItem from './TableHistoryItem'
import TableModalWrapper from './TableModalWrapper'
import cloneDeep from 'lodash/cloneDeep';
import _ from 'lodash';

import config from './config';

console.log("using effective configuration", config);


let tableObjects = [];

export let CURRENT_TABLES = {
    tables: [],
    transactions: []
};

const LOCALSTORAGE_VERSION_KEY = 'BilliardManager3001_version';
export const LOCALSTORAGE_KEY = 'BilliardManager3001_current-tables';

const localVersion = localStorage.getItem(LOCALSTORAGE_VERSION_KEY);
if (!localVersion || localVersion !== config.version) {
    console.log(`version is not the same! ${localVersion} in LS, ${config.version} needed. resetting localstorage.`);
    localStorage.clear();
    localStorage.setItem(LOCALSTORAGE_VERSION_KEY, config.version);
}

export default class TableManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            highlightedTable: null,
            passedTransactions: [],
            tableActive: [],
            activeTab: 'clock'
        };

        this.syncTime = config.timeIntervalSync;
        this.timer = null;
        this.tableModalWrapper = null;

        for (let i = 0; i < config.tableNumbers.length; i++) {
            if (config.tableNumbers[i] === null) {
                tableObjects.push(null);
            } else {
                const type = config.tableNumbers[i][0] === 'B' ? 'billiard': 'dart';
                const nr = config.tableNumbers[i][1];
                tableObjects.push({ ref: null, id: i, nr, type });
            }
        }
    }

    PrepareTables() {
        var currentTables = window.localStorage.getItem(LOCALSTORAGE_KEY) || [];

        if (currentTables.length > 0) {
            //parse local storage
            currentTables = JSON.parse(currentTables);
            var tables = currentTables.tables;


            for (var j = 0; j < tables.length; j++) {
                if (tables[j] !== null) {
                    tableObjects[tables[j].id].ref.CopyFromJson(tables[j]);
                    this.SetActive(tables[j].id, true);
                }
            }

            var copiedTransactions = [];
            if (currentTables.transactions) {
                currentTables.transactions.map((trans) => {
                    copiedTransactions.push(trans);
                    return trans;
                });
                this.setState({
                    passedTransactions: copiedTransactions
                });
                this.timer.UpdateTotal(copiedTransactions);
            }
        }
    }

    componentDidMount() {
        this.PrepareTables();

        window.addEventListener('keypress', (evt) => {
            this.ToggleChildByKeypress(evt)
        });
    }

    ResetTransactions() {
        this.setState({
            passedTransactions: []
        });
        this.timer.UpdateTotal([]);
        this.SaveToStorage();
    }

    ToggleChildByKeypress(e) {
        let intKey = (window.Event) ? e.which : e.keyCode;

        if (this.tableModalWrapper.state.modalIsOpen) {
            if (intKey === 49 || intKey === 50) {
                this.tableModalWrapper.closeByKey(e, intKey === 49);
            }
        } else {
            //hande cases 1-9
            if (intKey > 47 && intKey < 58) {
                let tableNo = 1;
                if (intKey === 48) {
                    tableNo = 10;
                } else {
                    tableNo = intKey - 48; //plus one for real table number (not index)
                }

                let idx = config.tableNumbers.map(t => t === null ? null: Number.parseInt(t[1], 10)).indexOf(tableNo);
                if (idx !== -1) {
                    this.setState({
                        highlightedTable: idx
                    });
                }

            } else if (intKey === 13 || intKey === 32) {
                if (this.state.highlightedTable !== null) {
                    tableObjects[this.state.highlightedTable].ref.HandleEnter();
                }
            } else if (intKey === 99 || intKey === 67) {
                this.timer.ShowAllSums();
            }
        }

        e.preventDefault();
        e.stopPropagation();
    }

    UpdateTables() {
        this.SaveToStorage();
    }

    SaveToStorage() {
        CURRENT_TABLES.transactions = this.state.passedTransactions;

        let tempTables = JSON.stringify(CURRENT_TABLES);
        window.localStorage.setItem(
            LOCALSTORAGE_KEY,
            tempTables
        );
    }


    StartTable(table) {
        this.SetActive(table.id, table.active);
        let clone = cloneDeep(table);
        clone.ref = null;
        CURRENT_TABLES.tables[table.id] = clone;

        this.SaveToStorage();
    }

    UpdateCallback(table) {
        CURRENT_TABLES.tables[table.id] = cloneDeep(table);
    }

    SetActive(id, active, initial) {
        let tableActive = this.state.tableActive;
        tableActive[id] = active;
        this.setState({
            tableActive: tableActive
        });
        this.timer.UpdateUsedTables(this.state.tableActive);
    }

    StopTable(table) {
        this.SetActive(table.id, false);

        _.remove(CURRENT_TABLES.tables, { id: table.id });

        // es-lint disabled
        let clone = cloneDeep(table);
        clone.transId = calculateTransId();

        //only safe a view last transactions. reverse array, add item as natural ordered, reverse again.
        let passedTransactions = this.state.passedTransactions.reverse();
        passedTransactions.push(clone);

        this.setState({
            passedTransactions: passedTransactions.reverse(),
            highlightedTable: null
        });

        this.SaveToStorage();

        this.timer.UpdateTotal(this.state.passedTransactions);

        this.tableModalWrapper.StartModal('tables', { table: clone, isRecycle: false });

    }

    UpdateChildren(timeElapsed) {
        tableObjects.map(obj => {
            if (obj !== null) {
                return obj.ref.UpdateTime(config.timeIntervalToUpdate);
            }
            return null;
        });

        if (timeElapsed % this.syncTime === 0) {
            this.UpdateTables();
        }
    }

    ReactivateOpenModal(table) {
        this.tableModalWrapper.StartModal('tables', { table: table, isRecycle: true });
    }

    ShowSums() {
        this.tableModalWrapper.StartModal('sums', { sums: this.state.passedTransactions });
    }

    ReactivateTable(table) {
        if (tableObjects[table.id].ref.isActive()) {
            return;
        }

        this.SetActive(table.id, true);
        CURRENT_TABLES.tables[table.id] = table;
        tableObjects[table.id].ref.Reactivate(table);
        let newTrans = _.filter(this.state.passedTransactions, function (tab) {
            return tab.endDate !== table.endDate;
        });

        this.setState({
            highlightedTable: null,
            passedTransactions: newTrans
        });

        //pass temp data cause state is not refreshed before update total finishes.
        this.timer.UpdateTotal(newTrans);

        this.SaveToStorage();
    }

    UpdateHighlight(tableId) {
        this.setState({
            highlightedTable: tableId
        })
    }

    ChangeTab(tab) {
        this.setState({
            activeTab: tab
        });
    }

    AvoidClick(evt, name) {
        this.ChangeTab(name);
        evt.stopPropagation();
        evt.preventDefault();
    }

    render() {
        const templ1 = [];
        for (let i = 0; i < Math.min(5, tableObjects.length); i++) {

            let idx = i;
            let obj = tableObjects[i];

            if (obj === null) {
                templ1.push((
                    <div className="tb col-3 tb-status-stop" key={idx}></div>
                ));
            } else {
                templ1.push((
                    <Table key={idx} id={obj.id} nr={tableObjects[i].nr} type={tableObjects[i].type}
                        ref={instance => {
                            obj.ref = instance;
                        }}
                        highlighted={obj.id === this.state.highlightedTable}
                        startCallback={table => this.StartTable(table)}
                        stopCallback={table => this.StopTable(table)}
                        highlightCallback={tableId => {
                            this.UpdateHighlight(tableId)
                        }}
                        updateCallback={table => this.UpdateCallback(table)} />
                ));
            }
        }

        const templ2 = [];
        if (tableObjects.length > 5) {
            for (let i = 5; i < tableObjects.length; i++) {

                let idx = i;
                let obj = tableObjects[i];
                if (obj === null) {
                    templ2.push((
                        <div className="tb col-3 tb-status-stop" key={idx}></div>
                    ));
                } else {
                    templ2.push((
                        <Table key={idx} id={obj.id} nr={tableObjects[i].nr} type={tableObjects[i].type}
                            ref={instance => {
                                obj.ref = instance;
                            }}
                            highlighted={obj.id === this.state.highlightedTable}
                            startCallback={table => this.StartTable(table)}
                            stopCallback={table => this.StopTable(table)}
                            highlightCallback={tableId => {
                                this.UpdateHighlight(tableId)
                            }}
                            updateCallback={table => this.UpdateCallback(table)} />

                    ));
                }

            }
        }
        return (
            <div className={'table-manager'}>
                <div className={'row'}>
                    <TableModalWrapper ref={(instance) => {
                        this.tableModalWrapper = instance;
                    }} resumeCallback={(table) => {
                        this.ReactivateTable(table)
                    }} resetTransactionsCallback={() => {
                        this.ResetTransactions()
                    }} />


                    {templ1}

                    <div className={'col-6 clock-and-transactions'}>
                        <div className={'col-12'}>
                            <div className={'clock-logs-switch'}>
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <button
                                            className={"nav-link " + (this.state.activeTab === 'clock' ? 'active' : '')}
                                            onClick={(e) => this.AvoidClick(e, 'clock')}>Timer</button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={"nav-link " + (this.state.activeTab === 'logs' ? 'active' : '')}
                                            onClick={(e) => this.AvoidClick(e, 'logs')}>Transaktionen</button>
                                    </li>
                                    <li className="nav-item brand">
                                        <button className={'nav-link'}>Billiard-Manager 3001</button>
                                    </li>
                                </ul>
                            </div>
                            <div className={'timer-and-transaction-wrapper'}>
                                <div className={'timer-wrapper ' + (this.state.activeTab === 'logs' ? 'hidden' : '')}>
                                    <Timer ref={(instance) => {
                                        this.timer = instance
                                    }} update={newTime => {
                                        this.UpdateChildren(newTime);
                                    }} tables={config.tableNumbers.length} usedTables={this.state.tableActive}
                                        transactions={this.state.passedTransactions}
                                        showSumsCallback={() => this.ShowSums()} />
                                </div>
                                <div className={'transactions ' + (this.state.activeTab === 'clock' ? 'hidden' : '')}>
                                    <ul className="logs list-group list-group-flush">
                                        <li className={'log list-group-item shadow-sm empty-transactions ' + (this.state.passedTransactions.length === 0 ? '' : 'hidden')}>
                                            <h1>Keine Transaktionen vorhanden</h1>
                                        </li>
                                        {this.state.passedTransactions.map((trans) => {
                                            return <TableHistoryItem key={trans.transId} table={trans}
                                                recycleAvailable={(config.reactivateEnabled && this.state.tableActive[trans.id] !== true)}
                                                reactivateCallback={table => this.ReactivateOpenModal(table)} />
                                        })
                                        }</ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {templ2}
                </div>
            </div>
        );
    }
}

function calculateTransId() {
    var closeDate = new Date();
    return 'trans_' + closeDate.toLocaleDateString().replace('.', '-')
        + '_' + closeDate.getHours() + ':' + closeDate.getMinutes() + ':' + closeDate.getSeconds()
}