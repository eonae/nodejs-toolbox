import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

export const xmoment = extendMoment(Moment);
export * from 'moment-range';
