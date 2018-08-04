import React from 'react';
import Table from './Table';
import Timer from './Timer';
import TableHistoryItem from './TableHistoryItem'
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
            passedTransactions: []
        };

        for (var i = 0; i < this.props.tables; i++) {
            tableObjects.push({ref: null, id: i});
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
        var clone = cloneDeep(table);
        clone.ref = null;
        CURRENT_TABLES.tables[table.id] = clone;
    }

    StopTable(table) {
        this.setState({
            highlightedTable: null
        });

        CURRENT_TABLES.tables.splice(table.id, 1);

        // es-lint disabled
        var clone = cloneDeep(table);
        clone.transId = 'trans_' + this.state.passedTransactions.length;


        //only safe a view last transactions.
        var passedTransactions = this.state.passedTransactions;
        if (passedTransactions.length < SAVED_TRANSACTIONS) {
            passedTransactions.push(clone);
        } else {
            for (var i = 1; i < passedTransactions.length; i++) {
                passedTransactions[i - 1] = passedTransactions[i];
            }
            passedTransactions[SAVED_TRANSACTIONS - 1] = clone;
        }

        this.setState({
            passedTransactions: passedTransactions
        });
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

    ReactivateTable(table) {
        if (tableObjects[table.id].ref.isActive()) {
            return;
        }
        CURRENT_TABLES.tables[table.id] = table;
        tableObjects[table.id].ref.Reactivate(table);

        this.state.passedTransactions.splice(table.id, 1);
        this.setState({
            highlightedTable: null,
            passedTransactions: this.state.passedTransactions
        });
    }

    render() {
        return (
            <div>
                <Timer interval={this.props.interval} update={newTime => {
                    this.UpdateChildren(newTime);
                }}/>

                <div className={'row tables'}>{tableObjects.map((obj, idx) => {
                    return <Table key={idx} id={obj.id}
                                  ref={instance => {
                                      obj.ref = instance;
                                  }}
                                  highlighted={obj.id === this.state.highlightedTable}
                                  price={this.props.price}
                                  startCallback={table => this.UpdateTable(table)}
                                  stopCallback={table => this.StopTable(table)}/>
                })}</div>
                <ul className="logs list-group list-group-flush">
                    {this.state.passedTransactions.map(trans => {
                        return <TableHistoryItem key={trans.transId} table={trans}
                                                 price={this.props.price}
                                                 reactivateCallback={table => this.ReactivateTable(table)}/>
                    })
                    }</ul>
            </div>
        );
    }
}
