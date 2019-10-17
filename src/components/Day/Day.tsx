import React from 'react';
import { Moment } from 'moment';

import './Day.scss';

export interface IDateProps {
    date: Moment;
    isActive: boolean;
    onClick: any;
}

export default class Day extends React.Component<IDateProps> {
    render() {
        return (
            <div className={"day " + (this.props.isActive ? 'day_active' : '') } onClick={this.props.onClick}>
                <div className="day-header">
                    <div className="day-header__date">{this.props.date.format('DD')}</div>
                    <div className="day-header__day-of-week">{this.props.date.format('ddd')}</div>
                </div>
                <div className="day-header__content">
                    <div className="day__consumption">-{(1500).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>
                    <div className="day__income">+{(4233).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="day-header__footer">
                    <div className="day__balance">{(423582).toLocaleString(navigator.language, { minimumFractionDigits: 2 })}</div>
                </div>
            </div>
        );
    }
}
