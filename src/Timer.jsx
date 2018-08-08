import React from 'react';
import {GetTimeStringFromSeconds} from './Helpers';
import {GetTimeStringFromDate} from './Helpers';

export default class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startingTime: 0,
            timeElapsed: 0,
            currentTime: Date.now(),
        };
        this.intervalID = null;
        this.currentInterval = 0;
        this.usedTables = this.props.usedTables;
    }

    componentDidMount() {
        this.startTiming();
    }

    UpdateUsedTables(tables) {
        this.usedTables = tables;
    }

    startTiming() {
        this.setState({startingTime: Date.now()});
        this.intervalID = setInterval(() => this.timingFunction(), 1000);
    }

    timingFunction() {
        if (this.currentInterval++ === this.props.interval - 1) {
            this.currentInterval = 0;
            this.setState({
                timeElapsed: Math.floor((Date.now() - this.state.startingTime) / 1000),
                currentTime: Date.now()
            });
            this.props.update(this.state.timeElapsed);
        }
    }

    render() {
        const runningTime = [];
        let current = GetTimeStringFromSeconds(this.state.timeElapsed);
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== ':') {
                runningTime.push(<div key={i} className={'flip-clock-digit'}>{current[i]}</div>);
            } else {
                runningTime.push(<div key={i}>{current[i]}</div>);
            }
        }

        const globalDigits = [];
        let globalTime = GetTimeStringFromDate(this.state.currentTime);
        for (let i = 0; i < globalTime.length; i++) {
            if (globalTime[i] !== ':') {
                globalDigits.push(<div key={i} className={'flip-clock-digit'}>{globalTime[i]}</div>);
            } else {
                globalDigits.push(<div key={i}>{globalTime[i]}</div>);
            }
        }

        return (
            <div className={'timer'}>
                <div className="global-timer flip-clock">
                    {globalDigits}
                </div>
                <div className={"additional-info"}>
                    <div className={"nr-tables"}><div className={'nr-tables-inner'}> {this.usedTables} / {this.props.tables}</div></div>
                    <div className={"step-timer flip-clock"}>
                        {runningTime}
                    </div>
                </div>

                <div className={'branding'}>&copy;&nbsp;Kaufmann & Utsch Timing Solutions</div>
            </div>
        );
    }

}
