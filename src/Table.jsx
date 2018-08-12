import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            nr: this.props.nr,
            active: false,
            timeActive: 0,
            startDate: null,
            endDate: null
        };
    }

    CopyFromJson(table) {
        this.setState({
            active: true,
            timeActive: table.timeActive,
            startDate: table.startDate
        });
    }

    ToggleActive() {
        var active = !this.state.active;
        this.setState({
            active: active,
            startDate: active === true ? Date.now() : null
        });
        this.props.startCallback(this.state);
    }

    UpdateTime() {
        if (this.state.active) {
            this.setState({
                timeActive: (Date.now() - this.state.startDate) / 1000
            });
            this.props.startCallback(this.state);
        }
    }

    Reactivate(table) {
        this.setState({
            active: true,
            timeActive: table.timeActive,
            startDate: table.startDate,
            endDate: table.endDate
        });
    }

    isActive() {
        return this.state.active === true;
    }


    HandleEnter() {
        if (this.state.active) {
            this.StopTable();
        } else {
            this.ToggleActive();
        }
    }

    StopTable() {
        if (this.state.timeActive === 0 || this.state.active === false) return;
        //do some local stop stuff.
        this.setState({endDate: new Date()});
        this.props.stopCallback(this.state);

        //
        this.setState({
            id: this.props.id,
            nr: this.props.nr,
            active: false,
            timeActive: 0,
            startDate: null,
            endDate: null
        })
    }

    UpdateHighlight() {
        this.props.highlightCallback(this.state.id);
    }

    render() {
        return (
            <div className={"tb col-3 " + (this.state.active === true ? 'tb-status-play' : 'tb-status-stop')}
                 onClick={() => {
                     this.UpdateHighlight()
                 }}>
                <div className={'tb-wrap ' + (this.props.highlighted === true ? 'highlighted' : '')}>
                    <div className="tb-head shadow-sm">
                        <div className="row">
                            <div className="col-8">
                                <h1>Tisch <span className="tb-nr shadow-sm">{this.props.nr}</span></h1>
                            </div>
                            <div className="col-4 text-right pr-4 pt-1">
                                <span className="tb-button bt-play" onClick={() => this.StopTable()}>
                                    <h2><i className="far fa-play-circle"/></h2>
                                </span>
                                <span className="tb-button bt-pause">
                                    <h2><i className="far fa-pause-circle"/></h2>
                                </span>
                                <span className="tb-button bt-stop" onClick={() => this.ToggleActive()}><h2><i className="far fa-circle"/></h2></span>
                            </div>
                        </div>
                    </div>

                    <ul className="tb-content list-group list-group-flush">
                        <li className="list-group-item border-0">
                            <div className="row">
                                <div className="col-4"><h4><i className="fas fa-clock"></i></h4></div>
                                <div className="col-8 text-right">
                                    <h2>{GetTimeStringFromSeconds(this.state.timeActive)}</h2></div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-4"><h4><i className="fas fa-euro-sign"></i></h4></div>
                                <div className="col-8 text-right">
                                    <h2>{(Math.round(this.props.price * this.state.timeActive*100)/100).toFixed(2).replace('.',',')}</h2></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }


}
