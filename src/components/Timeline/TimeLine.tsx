import React from 'react';
import moment, { Moment } from 'moment';

import './TimeLine.css';

import Day from "../Day/Day";

export interface ITimeLineState {
    days: Moment[];
    activeDay: Moment;
}

export enum IOperationType {
    Income = 1,
    Consumption
}

export enum IOperationPeriod {
    Once = 1,
    EverySecond,
    EveryMinute,
    EveryHour,
    EveryDay,
    EveryWeek,
    EveryMonth,
    EveryYear
}

export interface IOperation {
    type: IOperationType;
    period: IOperationPeriod;
    date: number;
    finish: number;
    amount: number;
}

const getDatesInRange = (from: Moment, to: Moment): Moment[] => {
    const dates = [];

    let current = from.clone();

    let iters = 0;

    while (!current.isAfter(to) && iters <= 90) {
        dates.push(current.clone());
        current = current.clone().add(1, 'days');

        iters++;
    }

    return dates;
}

export default class TimeLine extends React.Component<any, ITimeLineState> {
    constructor(props: any) {
        super(props);

        const from = moment().subtract(31, 'days');
        const to = moment().add(31, 'days');

        this.state = {
            days: getDatesInRange(from, to),
            activeDay: moment()
        };
    }

    render() {
        console.log('>>> 1', this.state);
        return (
            <div className="timeline">
                {this.state.days.map((date) => <Day key={date.toString()}
                                                    date={date}
                                                    isActive={date.format('LL') === this.state.activeDay.format('LL')}
                                                    onClick={this.onDayClickHandler.bind(this, date)}/>)}
            </div>
        );
    }

    onDayClickHandler(day: Moment) {
        console.log(day);
        this.setState({
            activeDay: day
        });
    }
}
