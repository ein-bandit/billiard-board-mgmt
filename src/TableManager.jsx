import React from 'react';
import Table from './Table';
import Timer from './Timer';
import TableHistoryItem from './TableHistoryItem'
import html2canvas from "html2canvas";

var tableObjects = [];

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

    componentDidMount() {
        window.addEventListener('keypress', (evt) => {
            this.ToggleChildByKeypress(evt)
        });
    }

    ToggleChildByKeypress(e) {
        var intKey = (window.Event) ? e.which : e.keyCode;
        //hande cases 1-9
        console.log(intKey);
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
                console.log(tableObjects, this.state.highlightedTable);
                tableObjects[this.state.highlightedTable].ref.HandleEnter();
                this.setState({
                    highlightedTable: null
                });
            }

        }
        e.preventDefault();
        e.stopPropagation();
    }


    /*componentWillUnmount() {
        window.removeEventListener('keypress', this.ToggleChildByKeypress);
    }*/


    StopTable(table) {

        //save for passed transaction list

        this.setState({
            highlightedTable: null
        });

        table.transId = 'trans_' + this.state.passedTransactions.length;

        var passedTransactions = this.state.passedTransactions;
        passedTransactions.push(table);
        this.setState({
            passedTransactions: passedTransactions
        });
    }

    UpdateChildren(newTime) {
        //TODO: find a way to update child.
        tableObjects.map(obj => {
            return obj.ref.UpdateTime(this.props.interval);
        });
    }

    ReactivateTable(table) {
        /*if (tableObjects[table.id].ref.isActive()) {
            return;
        }*/

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
