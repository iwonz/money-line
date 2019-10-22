import React, { RefObject } from 'react';
import { head, get, upperFirst, set, forEach, concat } from 'lodash';
import moment, { Moment } from 'moment';
import { Motion, presets, spring } from 'react-motion';

import './TimeLine.scss';

import Day from '../Day/Day';
import { generateOperations } from '../../services/generator';

export interface ITimeLineState {
  activeDay: Moment;
  days: Moment[];
  scrollLeft: number;
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
  timeLineContentElement: HTMLDivElement;

  constructor(props: any) {
    super(props);

    const operations = generateOperations(15);

    this.state = {
      days: getDatesInRange(get(head(operations), 'start') as Moment, moment().add(1, 'month')),
      activeDay: moment(),
      scrollLeft: 0,
    };

    this.onScroll = this.onScroll.bind(this);
  }

  render() {
    const years: any = {};

    this.state.days.map(date => {
      const currentValue = get(years, `${date.format('YYYY')}.${date.format('MM')}`, []);
      set(years, `${date.format('YYYY')}.${date.format('MM')}`, concat(currentValue, date));
    });

    const content = Object.keys(years).map(year => {
      return (
        <div className="timeline__year" key={year}>
          <span className="timeline__year-header">{year}</span>
          {Object.keys(years[year]).map(month => {
            return (
              <div className="timeline__month" key={month}>
                <span className="timeline__month-header">{upperFirst(moment(month, 'MM').format('MMMM'))}</span>
                {years[year][month].map((date: Moment) => {
                  return (
                    <Day
                      key={date.valueOf()}
                      date={date}
                      isActive={date.format('LL') === this.state.activeDay.format('LL')}
                      onClick={this.onDayClickHandler.bind(this, date)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    });

    return (
      <div className="timeline" onWheel={this.onScroll}>
        <Motion defaultStyle={{ z: 0 }} style={{ z: spring(this.state.scrollLeft, presets.noWobble) }}>
          {({ z }) => (
            <div
              style={{ transform: `translate3d(-${z}px, 0, 0)`, willChange: `transform` }}
              className="timeline__content"
              ref={r => (this.timeLineContentElement = r)}
            >
              {content}
            </div>
          )}
        </Motion>
      </div>
    );
  }

  componentDidMount() {
    this.scrollToDate(this.state.activeDay);
  }

  onScroll(event) {
    event.preventDefault();

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const newScrollLeft = this.getNewScrollLeft(this.state.scrollLeft + delta);

    if (this.state.scrollLeft === newScrollLeft) {
      return;
    }

    const scrolling = () => {
      this.setState({ scrollLeft: newScrollLeft });
      this.updateHeaders();
    };

    // Begin Scrolling Animation
    window.requestAnimationFrame(scrolling);
  }

  getNewScrollLeft(candidate: number): number {
    if (candidate < 0) {
      return 0;
    }

    if (!this.timeLineContentElement) {
      return candidate;
    }

    const maxScrollLeft =
      this.timeLineContentElement.offsetWidth - this.timeLineContentElement.parentElement.offsetWidth;

    if (candidate > maxScrollLeft) {
      return maxScrollLeft;
    }

    return candidate;
  }

  onDayClickHandler(date: Moment) {
    this.setState(
      {
        activeDay: date,
      },
      () => {
        this.scrollToDate(this.state.activeDay);
      },
    );
  }

  updateHeaders() {
    if (!this.timeLineContentElement) {
      return;
    }

    const scrollLeft = this.state.scrollLeft;

    forEach(this.timeLineContentElement.querySelectorAll('.timeline__month-header'), (headerElement: any) => {
      const headerWidth = headerElement.offsetWidth;
      const parentOffsetLeft = headerElement.parentNode.offsetLeft;
      const parentOffsetWidth = headerElement.parentNode.offsetWidth;
      const yearWidth = headerElement.parentNode.parentNode.firstElementChild.offsetWidth;

      if (
        scrollLeft >= parentOffsetLeft - headerWidth &&
        scrollLeft <= parentOffsetLeft + parentOffsetWidth - headerWidth - yearWidth
      ) {
        headerElement.style.left = `${scrollLeft - parentOffsetLeft + yearWidth + 15}px`;
      } else {
        headerElement.style.left = '0px';
      }
    });

    forEach(this.timeLineContentElement.querySelectorAll('.timeline__year-header'), (headerElement: any) => {
      const headerWidth = headerElement.offsetWidth;
      const parentOffsetLeft = headerElement.parentNode.offsetLeft;
      const parentOffsetWidth = headerElement.parentNode.offsetWidth;

      if (scrollLeft >= parentOffsetLeft && scrollLeft <= parentOffsetLeft + parentOffsetWidth - headerWidth) {
        headerElement.style.left = `${scrollLeft - parentOffsetLeft}px`;
      } else {
        headerElement.style.left = '0px';
      }
    });
  }

  scrollToDate(date: Moment) {
    if (!this.timeLineContentElement) {
      return;
    }

    const currentDayElement: HTMLDivElement | null = this.timeLineContentElement.querySelector(
      `.day[data-date="${date.format('LL')}"]`,
    );
    const monthElement = currentDayElement.closest<HTMLDivElement>('.timeline__month');
    const yearElement = currentDayElement.closest<HTMLDivElement>('.timeline__year');

    if (!currentDayElement || !yearElement || !monthElement) {
      return;
    }

    const newScrollLeft = this.getNewScrollLeft(
      yearElement.offsetLeft +
        monthElement.offsetLeft +
        currentDayElement.offsetLeft -
        currentDayElement.offsetWidth -
        currentDayElement.offsetWidth / 1.5,
    );

    this.setState(
      {
        scrollLeft: newScrollLeft,
      },
      () => this.updateHeaders(),
    );
  }
}
