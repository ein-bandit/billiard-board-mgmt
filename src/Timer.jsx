import React from 'react'
import { GetPrice, GetTimeStringFromSeconds, GetTimeStringFromDate } from './Helpers'
import lodash from 'lodash'

import config from './config'

export default class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startingTime: 0,
            timeElapsed: 0,
            currentTime: Date.now(),
            total: 0,
        }
        this.intervalID = null
        this.currentInterval = 0
        this.usedTables = this.props.usedTables
    }

    componentDidMount() {
        this.startTiming()
    }

    UpdateUsedTables(tables) {
        this.usedTables = tables
    }

    ShowAllSums() {
        if (this.state.total === 0) return

        this.props.showSumsCallback()
    }

    UpdateTotal(passedTransactions) {
        let total = 0
        lodash.forEach(passedTransactions, function (trans) {
            total += GetPrice(trans.timeActive, trans.type)
        })

        this.setState({
            total: total,
        })
    }

    startTiming() {
        this.setState({ startingTime: Date.now() })
        this.intervalID = setInterval(() => this.timingFunction(), 1000)
    }

    timingFunction() {
        if (this.currentInterval++ === config.timeIntervalToUpdate - 1) {
            this.currentInterval = 0
            this.setState({
                timeElapsed: Math.floor((Date.now() - this.state.startingTime) / 1000),
                currentTime: Date.now(),
            })
            this.props.update(this.state.timeElapsed)
        }
    }

    render() {
        const runningTime = []
        let current = GetTimeStringFromSeconds(this.state.timeElapsed)
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== ':') {
                runningTime.push(
                    <div key={i} className={'flip-clock-digit'}>
                        {current[i]}
                    </div>
                )
            } else {
                runningTime.push(<div key={i}>{current[i]}</div>)
            }
        }

        const globalDigits = []
        let globalTime = GetTimeStringFromDate(this.state.currentTime)
        for (let i = 0; i < globalTime.length; i++) {
            if (globalTime[i] !== ':') {
                globalDigits.push(
                    <div key={i} className={'flip-clock-digit'}>
                        {globalTime[i]}
                    </div>
                )
            } else {
                globalDigits.push(<div key={i}>{globalTime[i]}</div>)
            }
        }

        return (
            <div className={'timer'}>
                <div className="global-timer-wrapper">
                    <div className="global-timer flip-clock">{globalDigits}</div>
                    <div className={'nr-tables'}>
                        <div className={'nr-tables-inner'}>
                            {this.usedTables.filter((t) => t === true).length} / {config.tableNumbers.filter((t) => t !== null).length}
                        </div>
                    </div>
                </div>
                <div className={'additional-info'}>
                    <div className={'step-timer flip-clock'}>{runningTime}</div>
                    <div className={'nr-tables'}>
                        <div
                            className={'nr-tables-inner sum-holder'}
                            onClick={() => {
                                this.ShowAllSums()
                            }}
                        >
                            <div className={'sum'}>
                                <span>{'Abrechnen '}</span>
                                <span>{'('}</span>
                                <i className={'fa fa-eur'} />
                                <span>{' ' + (Math.round(this.state.total * 100) / 100).toFixed(2).replace('.', ',')}</span>
                                <span>{')'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'branding'}>&copy;&nbsp;Kaufmann & Utsch Timing Solutions</div>
            </div>
        )
    }
}
