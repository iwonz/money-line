import { isNil, random, sample, find, orderBy } from 'lodash';
import moment, { Moment } from "moment";
import momentRandom from 'moment-random';

let uuid = 0;

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
    id: number;
    type: IOperationType;
    period: IOperationPeriod;
    start: Moment;
    finish: Moment;
    amount: number;
}

export function generateOperation(
    type: IOperationType = sample(Object.values(IOperationType)) as IOperationType,
    period: IOperationPeriod = sample(Object.values(IOperationPeriod)) as IOperationPeriod,
    start: Moment = momentRandom(moment().add(1, 'month'), moment().subtract(1, 'month')),
    finish: Moment = momentRandom(moment().add(2, 'month'), moment().add(1, 'month')),
    amount?: number
): IOperation {
    const randomFrom = type === IOperationType.Income ? 1 : -150000;
    const randomTo = type === IOperationType.Income ? 150000 : -1;

    return {
        id: ++uuid,
        type,
        period,
        start,
        finish,
        amount: isNil(amount) ? random(randomFrom, randomTo, true) : amount
    };
}

export function generateOperations(count: number): IOperation[] {
    let operations = [];

    for (let i = 1; i <= count; i++) {
        let operation = generateOperation();

        while (find(operations, (item) => item.start.format('LL') === operation.start.format('LL'))) {
            operation = generateOperation();
        }

        operations.push(operation);
    }

    return orderBy(operations, operation => +operation.start);
}
