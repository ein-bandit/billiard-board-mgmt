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
                tables[pos].entries.push((Math.round(s.timeActive * price * 100)/100).toFixed(2).replace('.',','));
            } else {
                tables.push({nr: s.nr, sum: s.timeActive * price, entries: [(Math.round(s.timeActive * price * 100)/100).toFixed(2).replace('.',',')]});
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
                        <div className="col-12">
                            <h1>Auflistung abgerechnete Tische</h1>
                        </div>
                    </div>
                </div>
                <ul className="list-group summary-group">
                    {this.state.tables.map(function (s, idx) {
                        return (<li key={idx} className="list-group-item">
                            <span className="col-4">Tisch {s.nr}</span>
                            <span className={'col-8 summary-number'}><span>{s.entries.join(' + ')}</span>
                                <span>{(Math.round(s.sum * 100) / 100).toFixed(2).replace('.',',')}</span></span></li>);
                    })}
                    <li className="list-group-item active">Gesamtsumme:<span className="col-8 summary-number">{(Math.round(this.state.total * 100) / 100).toFixed(2).replace('.',',')}</span></li>
                </ul>
                <div className={'tb-modal-buttons'}>
                <button className={'tb-modal-btn tb-modal-btn-resume btn btn-default'} onClick={(event) => this.CloseSumsModal(event)}>Schließen (1)</button>
                <button className={'tb-modal-btn tb-modal-btn-close btn btn-default'} onClick={(event) => this.ResetAndClose(event)}>Abgerechnet und Löschen (2)</button>
                </div>
            </div>
        );
    }

}