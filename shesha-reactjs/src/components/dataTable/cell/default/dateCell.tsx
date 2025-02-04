import moment from 'moment';
import React from 'react';
import { IDataCellProps } from '../interfaces';

export interface IDateCellProps<D extends object = {}, V = any> extends IDataCellProps<D, V> {
}

export const DateCell = <D extends object = {}, V = any>(props: IDateCellProps<D, V>) => {
    return props.value
        ? <>{ moment(props.value).format(props.propertyMeta?.dataFormat || 'DD/MM/YYYY') }</>
        : null;
};

export default DateCell;