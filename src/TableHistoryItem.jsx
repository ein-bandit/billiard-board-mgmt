import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';
import {GetTimeStringFromDate} from './Helpers';

export default class TableHistoryItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            table: props.table
        }
    }

    Reactivate() {
        this.props.reactivateCallback(this.state.table);
    }

    render() {
        return (
            <li className={'log list-group-item shadow-sm'}>
                <h3 className={'inline mr-5'}>{GetTimeStringFromDate(this.state.table.endDate)}</h3>
                <h2 className={'inline mx-3'}>Tisch <span className={'log-nr shadow'}>{this.state.table.id}</span></h2>
                <h3 className={'inline mx-3'}><i className={'fas fa-clock'}/>{GetTimeStringFromSeconds(this.state.table.timeActive)}</h3>
                <h3 className={'inline mx-3'}><i className={'fas fa-euro-sign'}/>{(this.props.price * this.state.table.timeActive).toFixed(2)}</h3>
                <h3 className={'inline ml-3'}><i className={'fas fa-recycle'}/></h3>
            </li>
        );
    }

}