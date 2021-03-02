// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { EventModel } from 'bryntum-scheduler/scheduler.lite.umd.js';

export default class TaskModel extends EventModel {

    eventType: string;

    static get fields() {
        return [
            { name : 'eventType', defaultValue : 'Event' }
        ];
    }
}
