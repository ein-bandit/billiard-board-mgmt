import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';
import './Table.css'

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
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
            startDate: active === true ? new Date() : null
        });
        this.props.startCallback(this.state);
    }

    UpdateTime(interval) {
        if (this.state.active) {
            this.setState({
                timeActive: this.state.timeActive + interval
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
        if (this.state.timeActive === 0) return;
        //do some local stop stuff.
        this.props.stopCallback(this.state);

        //
        this.setState({
            id: this.props.id,
            active: false,
            timeActive: 0,
            startDate: null,
            endDate: null
        })
    }

    GetTableClasses() {
        var classes = this.state.active ? 'tb-status-play' : 'tb-status-stop';

        if (this.props.highlighted) {
            classes += ' highlighted';
        }

        return classes;
    }


    render() {
        return (
            <div className={"tb tb-status-stop col-3 " + this.GetTableClasses()}>
                <div className="tb-wrap">
                    <div className="tb-head shadow-sm">
                        <div className="row">
                            <div className="col-8">
                                <h1>Tisch <span className="tb-nr shadow-sm">{this.state.id}</span></h1>
                            </div>
                            <div className="col-4 text-right pr-4 pt-1">
                <span className="tb-button bt-play"><h2><i
                    className="far fa-play-circle"></i></h2></span>
                                <span className="tb-button bt-pause"><h2><i
                                    className="far fa-pause-circle"></i></h2></span>
                                <span className="tb-button bt-stop"><h2><i className="far fa-circle"></i></h2></span>
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
                                    <h2>{(this.props.price * this.state.timeActive).toFixed(2)}</h2></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }


}
