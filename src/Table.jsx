import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';
import cloneDeep from 'lodash/cloneDeep';
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

    ToggleActive() {
        this.setState({
            active: !this.state.active,
            startDate: this.state.active ? new Date() : null
        });
    }

    UpdateTime(interval) {
        if (this.state.active) {
            this.setState({
                timeActive: this.state.timeActive + interval
            });
        }
    }

    Reactivate(table) {
        this.setState({
            active: false,
            timeActive: table.timeActive,
            startDate: table.startDate,
            endDate: table.endDate
        });
    }

    isActive() {
        return this.state.active === true;
    }
    render() {
        return (
            <div className={this.props.highlighted === true ? 'bordered' : ''}>
                {'table' + this.state.id} : {GetTimeStringFromSeconds(this.state.timeActive)}
                <button onClick={() => this.ToggleActive()}>
                    <span
                        style={{color: this.state.active === true ? 'red' : 'green'}}>{this.state.active === true ? 'deactivate' : 'activate'}</span>
                </button>
                <button onClick={() => this.StopTable()}>stop</button>
                <span>Price {(this.props.price * this.state.timeActive).toFixed(2)} €</span>
            </div>
        );
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
        this.props.stopCallback(cloneDeep(this.state));

        //
        this.setState({
            id: this.props.id,
            active: false,
            timeActive: 0,
            startDate: null,
            endDate: null
        })
    }

}
