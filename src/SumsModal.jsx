import React from 'react';
import lodash from 'lodash';

export default class SumsModal extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.sums);
        //split transactions by table num.
        let total = 0;
        let tables = [];


        let price = this.props.price;
        this.props.sums.forEach(function (s, idx) {
            let pos = lodash.findIndex(tables, {nr: s.nr});
            if (pos > -1) {
                tables[pos].sum += s.timeActive * price;
                tables[pos].entries.push(s);
            } else {
                tables.push({nr: s.nr, sum: s.timeActive * price, entries: [s]});
            }
            total += s.timeActive * price;
        });

        console.log(tables);

        this.state = {
            table: props.table,
            tables: tables,
            total: total
        }
    }

    CloseSumsModal(event) {
        this.props.closeCallback(event);
    }

    ResetAndClose(event) {
        this.props.resetCallback(event);
    }

    render() {
        return (
            <div className={'tb-wrap'}>
                <div className="tb-head shadow-sm">
                    <div className="row">
                        <div className="col-8">
                            <h1>Auflistung abgerechnete Tische</h1>
                        </div>
                    </div>
                </div>
                <ul className="list-group">
                    {this.state.tables.map(function (s, idx) {
                        return (<li key={idx} className="list-group-item">
                            <span className="col-2">Tisch: {s.nr}</span>
                            <span className={'col-6'}>all table prices</span>
                            <span className={'col-4'}>{Math.round(s.sum * 100) / 100}</span></li>);
                    })}
                    <li className="list-group-item active">Gesamtsumme: {Math.round(this.state.total * 100) / 100}</li>
                </ul>
                <button onClick={(event) => this.CloseSumsModal(event)}>close</button>
                <button onClick={(event) => this.ResetAndClose(event)}>reset app</button>
            </div>
        );
    }

}