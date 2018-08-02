import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';

export default class TableHistoryItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            table: props.table
        }
    }

    componentDidMount() {
        console.log(this.state.table);
    }

    Reactivate() {
        this.props.reactivateCallback(this.state.table);
    }

    render() {
        return (
            <div>
                <div>{'transaction ' + this.state.table.transId}</div>
                <div>{'table' + this.state.table.id} : {GetTimeStringFromSeconds(this.state.table.timeActive)}</div>
                <div>Price {(this.props.price * this.state.table.timeActive).toFixed(2)} €</div>
                <button onClick={() => this.Reactivate()}>react</button>
            </div>
        );
    }

}