import React from 'react';
import Table from './Table';
import Timer from './Timer';
import TableHistoryItem from './TableHistoryItem'
import TableModalWrapper from './TableModalWrapper'
import cloneDeep from 'lodash/cloneDeep';


var tableObjects = [];

const SYNC_TIME = 10;
const SAVED_TRANSACTIONS = 5;
const CURRENT_TABLES = {
    tables: [],
    transactions: []
};

const LOCALSTORAGE_KEY = 'BilliardManager3001_current-tables';

export default class TableManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            highlightedTable: null,
            passedTransactions: [],
            modalIsOpen: false,
            tableActive: [],
            activeTab: 'clock'
        };

        this.timer = null;
        this.tableModalWrapper = null;

        for (let i = 0; i < this.props.tables; i++) {
            tableObjects.push({ref: null, id: i, nr: this.props.tableNumbers[i]});
        }
    }

    PrepareTables() {
        var currentTables = window.localStorage.getItem(LOCALSTORAGE_KEY) || [];

        if (currentTables.length > 0) {
            //parse local storage
            currentTables = JSON.parse(currentTables);
            var tables = currentTables.tables;


            for (var j = 0; j < tables.length; j++) {
                tableObjects[tables[j].id].ref.CopyFromJson(tables[j]);
                this.SetActive(tables[j].id, true);
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
            }
        }
    }

    componentDidMount() {
        this.PrepareTables();

        window.addEventListener('keypress', (evt) => {
            this.ToggleChildByKeypress(evt)
        });
    }

    ToggleChildByKeypress(e) {
        var intKey = (window.Event) ? e.which : e.keyCode;
        //hande cases 1-9
        //console.log(intKey);
        if (intKey > 47 && intKey < 58) {
            var tableNo = 1;
            if (intKey === 48) {
                tableNo = 10;
            } else {
                tableNo = intKey - 48; //plus one for real table number (not index)
            }

            this.SetActive(tableNo - 1, true);
            this.setState({
                highlightedTable: tableNo - 1
            });

        } else if (intKey === 13 || intKey === 32) {
            if (this.state.highlightedTable !== null) {
                tableObjects[this.state.highlightedTable].ref.HandleEnter();
            }

        }
        e.preventDefault();
        e.stopPropagation();
    }

    UpdateTables() {
        CURRENT_TABLES.transactions = this.state.passedTransactions;

        var tempTables = JSON.stringify(CURRENT_TABLES);
        window.localStorage.setItem(
            LOCALSTORAGE_KEY,
            tempTables
        );
    }


    UpdateTable(table) {
        this.SetActive(table.id, table.active);
        var clone = cloneDeep(table);
        clone.ref = null;
        CURRENT_TABLES.tables[table.id] = clone;
    }

    SetActive(id, active) {
        var tableActive = this.state.tableActive;
        tableActive[id] = active;
        this.setState({
            tableActive: tableActive
        });
        this.timer.UpdateUsedTables(this.state.tableActive.length);
    }

    StopTable(table) {
        this.SetActive(table.id, false);
        this.setState({
            highlightedTable: null
        });

        CURRENT_TABLES.tables.splice(table.id, 1);

        // es-lint disabled
        var clone = cloneDeep(table);
        clone.transId = calculateTransId();

        //only safe a view last transactions. reverse array, add item as natural ordered, reverse again.
        var passedTransactions = this.state.passedTransactions.reverse();
        if (passedTransactions.length < SAVED_TRANSACTIONS) {
            passedTransactions.push(clone);
        } else {
            for (var i = 1; i < passedTransactions.length; i++) {
                passedTransactions[i - 1] = passedTransactions[i];
            }
            passedTransactions[SAVED_TRANSACTIONS - 1] = clone;
        }

        this.setState({
            passedTransactions: passedTransactions.reverse()
        });

        this.tableModalWrapper.StartModal(clone);

    }

    UpdateChildren(timeElapsed) {
        tableObjects.map(obj => {
            return obj.ref.UpdateTime(this.props.interval);
        });

        if (timeElapsed % SYNC_TIME === 0) {
            console.log("syncing all", CURRENT_TABLES);

            this.UpdateTables();
        }
    }

    ReactivateOpenModal(table) {
        this.tableModalWrapper.StartModal(table);
    }

    ReactivateTable(table) {
        if (tableObjects[table.id].ref.isActive()) {
            return;
        }
        this.SetActive(table.id, true);
        CURRENT_TABLES.tables[table.id] = table;
        tableObjects[table.id].ref.Reactivate(table);

        this.state.passedTransactions.splice(table.id, 1);
        this.setState({
            highlightedTable: null,
            passedTransactions: this.state.passedTransactions
        });
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
        console.log(evt);
        this.ChangeTab(name);
        evt.stopPropagation();
        evt.preventDefault();
    }

    render() {
        const templ1 = [];
        for (let i = 0; i < 5; i++) {

            let idx = i;
            let obj = tableObjects[i];
            templ1.push((
                <Table key={idx} id={obj.id} nr={tableObjects[i].nr}
                       ref={instance => {
                           obj.ref = instance;
                       }}
                       highlighted={obj.id === this.state.highlightedTable}
                       price={this.props.price}
                       startCallback={table => this.UpdateTable(table)}
                       stopCallback={table => this.StopTable(table)}
                       highlightCallback={tableId => {
                           this.UpdateHighlight(tableId)
                       }}/>
            ));

        }

        const templ2 = [];
        for (let i = 5; i < tableObjects.length; i++) {

            let idx = i;
            let obj = tableObjects[i];
            templ2.push((
                <Table key={idx} id={obj.id} nr={tableObjects[i].nr}
                       ref={instance => {
                           obj.ref = instance;
                       }}
                       highlighted={obj.id === this.state.highlightedTable}
                       price={this.props.price}
                       startCallback={table => this.UpdateTable(table)}
                       stopCallback={table => this.StopTable(table)}
                       highlightCallback={tableId => {
                           this.UpdateHighlight(tableId)
                       }}/>

            ));

        }

        return (
            <div className={'table-manager'}>
                <div className={'row'}>
                    <TableModalWrapper ref={(instance) => {
                        this.tableModalWrapper = instance;
                    }} price={this.props.price} resumeCallback={(table) => {
                        this.ReactivateTable(table)
                    }}/>


                    {templ1}

                    <div className={'col-6 clock-and-transactions'}>
                        <div className={'col-12'}>
                            <div className={'clock-logs-switch'}>
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <a className={"nav-link " + (this.state.activeTab === 'clock' ? 'active' : '')}
                                           href="#" onClick={(e) => this.AvoidClick(e, 'clock')}>Timer</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={"nav-link " + (this.state.activeTab === 'logs' ? 'active' : '')}
                                           href="#" onClick={(e) => this.AvoidClick(e, 'logs')}>Transaktionen</a>
                                    </li>
                                </ul>
                            </div>
                            <div className={'timer-and-transaction-wrapper'}>
                                <div className={'timer-wrapper ' + (this.state.activeTab === 'logs' ? 'hidden' : '')}>
                                    <Timer interval={this.props.interval} ref={(instance) => {
                                        this.timer = instance
                                    }} update={newTime => {
                                        this.UpdateChildren(newTime);
                                    }} tables={this.props.tables} usedTables={this.state.tableActive.length}/>
                                </div>
                                <div className={'transactions ' + (this.state.activeTab === 'clock' ? 'hidden' : '')}>
                                    <ul className="logs list-group list-group-flush">
                                        <li className={'log list-group-item shadow-sm empty-transactions ' + (this.state.passedTransactions.length === 0 ? '' : 'hidden')}>
                                            <h1>Keine Transaktionen vorhanden</h1>
                                        </li>
                                        {this.state.passedTransactions.map((trans) => {
                                            return <TableHistoryItem key={trans.transId} table={trans}
                                                                     nr={tableObjects[trans.id].nr}
                                                                     price={this.props.price}
                                                                     recycleAvailable={(this.props.reactivateEnabled && this.state.tableActive[trans.id] !== true)}
                                                                     reactivateCallback={table => this.ReactivateOpenModal(table)}/>
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