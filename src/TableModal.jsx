import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';
import {GetTimeStringFromDate} from './Helpers';

export default class TableModal extends React.Component {

    constructor(props) {
        super(props);
        console.log("in table modal constr", props);
        this.state = {
            table: props.table,
            isRecycle: props.isRecycle
        }
    }

    CloseTableModal(event, resume) {
        this.props.closeCallback(event, this.state.table, resume);
    }

    render() {
        return (
            <div className="tb-wrap">
                <div className="tb-head shadow-sm">
                    <div className="row">
                        <div className="col-8">
                            <h1>Abrechnung: Tisch <span
                                className="tb-nr shadow-sm">{this.state.table.id + 1}</span></h1>
                        </div>
                        <div className="col-4 text-right pr-4 pt-1">
                                <span className="tb-button bt-play">
                                    <h2><i className="far fa-play-circle"></i></h2>
                                </span>
                            <span className="tb-button bt-pause">
                                    <h2><i className="far fa-pause-circle"></i></h2>
                                </span>
                            <span className="tb-button bt-stop">
                                        <h2><i className="far fa-circle"></i></h2>
                                    </span>
                        </div>
                    </div>
                </div>

                <ul className="tb-content list-group list-group-flush">
                    <li className="list-group-item border-0">
                        <div className="row">
                            <div className="col-4"><h4><i className="fas fa-clock"></i> Start</h4></div>
                            <div className="col-8 text-right">
                                <h2>{GetTimeStringFromDate(this.state.table.startDate)}</h2></div>
                        </div>
                        <div className={'row'}>
                            <div className="col-4"><h4><i className="fas fa-clock"></i> Ende</h4></div>
                            <div className="col-8 text-right">
                                <h2>{GetTimeStringFromDate(this.state.table.endDate)}</h2></div>
                        </div>
                    </li>
                    <li className="list-group-item border-0">
                        <div className="row">
                            <div className="col-4"><h4><i className="fas fa-user-clock"></i></h4></div>
                            <div className="col-8 text-right">
                                <h2>{GetTimeStringFromSeconds(this.state.table.timeActive)}</h2></div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="row">
                            <div className="col-4"><h4><i className="fas fa-euro-sign"></i></h4></div>
                            <div className="col-8 text-right">
                                <h2>{(this.props.price * this.state.table.timeActive).toFixed(2).replace('.', ',')}</h2>
                            </div>
                        </div>
                    </li>
                </ul>

                <div className={'tb-modal-buttons'}>
                    <button className={'tb-modal-btn tb-modal-btn-resume btn btn-default'} onClick={(event) => {
                        this.CloseTableModal(event, true)
                    }}>{this.state.isRecycle === true ? 'Wiederherstellen (1)' : 'Fortsetzen (1)'}
                    </button>
                    <button className={'tb-modal-btn tb-modal-btn-close btn btn-default'} onClick={(event) => {
                        this.CloseTableModal(event, false)
                    }}>{this.state.isRecycle === true ? 'Abbrechen (2)' : 'Beenden (2)'}
                    </button>
                </div>
            </div>
        );
    }

}