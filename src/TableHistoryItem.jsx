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
            <li className={'log list-group-item shadow-sm ' + (this.props.recycleAvailable === true ? 'log-recycle' : '')}>
                <h3 className={'inline mr-5'}>{GetTimeStringFromDate(this.state.table.endDate)}</h3>
                <h3 className={'inline mx-3'}>Tisch <span className={'log-nr shadow'}>{this.state.table.nr}</span></h3>
                <h3 className={'inline mx-3'}><i
                    className={'fa fa-user'}/>&nbsp;{GetTimeStringFromSeconds(this.state.table.timeActive)}</h3>
                <h3 className={'inline mx-3'}><i
                    className={'fa fa-eur'}/>&nbsp;{(Math.round(this.props.price * this.state.table.timeActive * 100 ) / 100).toFixed(2).replace('.',',')}</h3>
                <h3 className={'inline ml-3 log-recycle-btn'} onClick={() => this.Reactivate()}><i
                    className={'fa fa-recycle'}/></h3>
            </li>
        );
    }

}