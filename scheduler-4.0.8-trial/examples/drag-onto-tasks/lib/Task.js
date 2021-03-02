/* eslint-disable no-unused-vars */
import EventModel from '../../../lib/Scheduler/model/EventModel.js';

export default class Task extends EventModel {
    static get defaults() {
        return {
            // in this demo, default duration for tasks will be hours (instead of days)
            durationUnit : 'h',
            equipment    : []
        };
    }
}
