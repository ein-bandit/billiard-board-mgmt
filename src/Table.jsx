import React from 'react';
import { GetTimeActive, GetFormattedPrice, GetTimeString } from './Helpers';

export default class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            nr: this.props.nr,
            active: false,
            timeActive: { active: 0, reduced: 0 },
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
                timeActive: GetTimeActive(this.state.startDate)
            });
            this.props.updateCallback(this.state);
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
        if (this.state.active === false ||
            (this.state.timeActive.active === 0 && this.state.timeActive.reduced === 0)) {
            return;
        }
        //do some local stop stuff.
        this.setState({ endDate: new Date() });
        this.props.stopCallback(this.state);

        //
        this.setState({
            id: this.props.id,
            nr: this.props.nr,
            active: false,
            timeActive: { active: 0, reduced: 0 },
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
                                    <h2><i className="fa fa-play-circle" /></h2>
                                </span>
                                <span className="tb-button bt-pause">
                                    <h2><i className="fa fa-pause-circle" /></h2>
                                </span>
                                <span className="tb-button bt-stop" onClick={() => this.ToggleActive()}><h2><i className="fa fa-circle-o" /></h2></span>
                            </div>
                        </div>
                    </div>

                    <ul className="tb-content list-group list-group-flush">
                        <li className="list-group-item border-0">
                            <div className="row">
                                <div className="col-4"><h4><i className="fa fa-clock-o"></i></h4></div>
                                <div className="col-8 text-right">
                                    <h2>{GetTimeString(this.state.timeActive)}</h2></div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col-4"><h4><i className="fa fa-eur"></i></h4></div>
                                <div className="col-8 text-right">
                                    <h2>{GetFormattedPrice(this.state.timeActive)}</h2></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }


}
