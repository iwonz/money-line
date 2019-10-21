import React, { RefObject, SyntheticEvent } from 'react';
import { head, get, set, forEach, concat } from 'lodash';
import moment, { Moment } from "moment";

import './TimeLine.scss';

import Day from "../Day/Day";
import { generateOperation, generateOperations, IOperation } from "../../services/generator";

export interface ITimeLineState {
    activeDay: Moment;
    days: Moment[];
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
};

export default class TimeLine extends React.Component<any, ITimeLineState> {
    timeLineContentRef: RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);

        const operations = generateOperations(15);

        this.state = {
            days: getDatesInRange(get(head(operations), 'start') as Moment, moment().add(1, 'month')),
            activeDay: moment()
        };

        this.timeLineContentRef = React.createRef();
    }

    render() {
        const years: any = {};

        this.state.days.map((date) => {
            const currentValue = get(years, `${date.format('YYYY')}.${date.format('MM')}`, []);
            set(years, `${date.format('YYYY')}.${date.format('MM')}`, concat(currentValue, date))
        });

        const content = Object.keys(years).map((year) => {
            return (
                <div className="timeline__year" key={year}>
                    <span className="timeline__year-header">{year}</span>
                    {Object.keys(years[year]).map((month) => {
                        return (
                            <div className="timeline__month" key={month}>
                                <span className="timeline__month-header">{month}</span>
                                {years[year][month].map((date: Moment) => {
                                    return (
                                        <Day key={date.valueOf()}
                                             date={date}
                                             isActive={date.format('LL') === this.state.activeDay.format('LL')}
                                             onClick={this.onDayClickHandler.bind(this, date)}/>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            );
        });

        return (
            <div className="timeline" onWheel={this.onTimeLineScroll.bind(this)} ref={this.timeLineContentRef}>
                <div className="timeline__content" >{content}</div>
            </div>
        );
    }

    componentDidMount() {
        setTimeout(() => {
            this.scrollToDate(moment());
        }, 50);
    }


    onDayClickHandler(date: Moment) {
        this.scrollToDate(date);

        this.setState({
            activeDay: date
        });
    }

    onTimeLineScroll(event: any) {
        const timeLineContentElement = this.timeLineContentRef.current;

        if (!timeLineContentElement) { return; }

        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

        timeLineContentElement.scrollLeft -= delta;

        this.updateHeaders();
    }

    updateHeaders() {
        const timeLineContentElement = this.timeLineContentRef.current;

        if (!timeLineContentElement) { return; }

        const scrollLeft = timeLineContentElement.scrollLeft;

        forEach(timeLineContentElement.querySelectorAll('.timeline__month-header'), (headerElement: any) => {
            const headerWidth = headerElement.offsetWidth;
            const parentOffsetLeft = headerElement.parentNode.offsetLeft;
            const parentOffsetWidth = headerElement.parentNode.offsetWidth;

            console.table({ scrollLeft, headerWidth, parentOffsetLeft, parentOffsetWidth });

            if (scrollLeft >= parentOffsetLeft && scrollLeft <= parentOffsetLeft + parentOffsetWidth) {
                headerElement.style.left = `${scrollLeft - parentOffsetLeft}px`;
            } else {
                headerElement.style.left = '0px';
            }
        });
    }

    scrollToDate(date: Moment) {
        const timeLineContentElement = this.timeLineContentRef.current;

        if (!timeLineContentElement) {
            return;
        }

        const today = date.format('LL');

        const currentDayElement: HTMLDivElement | null = timeLineContentElement.querySelector(`.day[data-date="${today}"]`);

        if (!currentDayElement) {
            return;
        }

        timeLineContentElement.scrollLeft = currentDayElement.offsetLeft - currentDayElement.offsetWidth - currentDayElement.offsetWidth / 1.5;
        this.updateHeaders();
    }
}
