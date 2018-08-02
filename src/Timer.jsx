import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';
import {GetTimeStringFromDate} from './Helpers';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startingTime: 0,
            timeElapsed: 0
        };
        this.currentInterval = 0;
    }

    componentDidMount() {
        this.startTiming();
    }

    startTiming() {
        this.setState({startingTime: Date.now()});
        this.intervalID = setInterval(() => this.timingFunction(), 1000);
    }

    timingFunction() {
        if (this.currentInterval++ === this.props.interval - 1) {
            this.currentInterval = 0;
            this.setState({timeElapsed: Math.floor((Date.now() - this.state.startingTime) / 1000)});
            this.props.update(this.state.timeElapsed);
        }
    }

    //remove intervalId on destroy.

    render() {
        return (
            <div>
                <div className="global-timer">{GetTimeStringFromSeconds(this.state.timeElapsed)}</div>
                <div>{GetTimeStringFromDate(this.state.startingTime)}</div>
            </div>
        );
    }

}
