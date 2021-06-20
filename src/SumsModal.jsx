import React from 'react';
import lodash from 'lodash';

import { GetPrice, GetFormattedPrice } from './Helpers';

export default class SumsModal extends React.Component {

    constructor(props) {
        super(props);
        let total = 0;
        let tables = [];

        //split transactions by table num.
        this.props.sums.forEach(function (s, idx) {
            let pos = lodash.findIndex(tables, { nr: s.nr });
            if (pos > -1) {
                tables[pos].sum += GetPrice(s.timeActive, s.type);
                tables[pos].entries.push(GetFormattedPrice(s.timeActive, s.type));
            } else {
                tables.push({ type: s.type, nr: s.nr, sum: GetPrice(s.timeActive, s.type), entries: [GetFormattedPrice(s.timeActive, s.type)] });
            }
            total += GetPrice(s.timeActive, s.type);
        });
        console.log(tables)

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
                            <span className="col-3">{s.type === "billiard" ? "Billard" : "Dart"} {s.nr}</span>
                            <span className={'col-9 summary-number'}><span>{s.entries.join(' + ')}</span>
                                <span>{(Math.round(s.sum * 100) / 100).toFixed(2).replace('.', ',')}</span></span></li>);
                    })}
                    <li className="list-group-item active">Gesamtsumme:<span className="col-8 summary-number">{(Math.round(this.state.total * 100) / 100).toFixed(2).replace('.', ',')}</span></li>
                </ul>
                <div className={'tb-modal-buttons'}>
                    <button className={'tb-modal-btn tb-modal-btn-resume btn btn-default'} onClick={(event) => this.CloseSumsModal(event)}>Schließen (1)</button>
                    <button className={'tb-modal-btn tb-modal-btn-close btn btn-default'} onClick={(event) => this.ResetAndClose(event)}>Abgerechnet und Löschen (2)</button>
                </div>
            </div>
        );
    }

}