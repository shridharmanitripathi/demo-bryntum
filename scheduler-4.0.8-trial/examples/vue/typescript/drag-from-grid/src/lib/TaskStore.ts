import Task from "./Task";
import { DateHelper, EventStore, EventModel } from "bryntum-scheduler";

export default class TaskStore extends EventStore {
    static get defaultConfig() {
        return {
            modelClass : Task
        };
    }

    public rescheduleOverlappingTasks(eventRecord: EventModel) {
        if (eventRecord.resource) {
            const futureEvents: EventModel[] = [],
                earlierEvents: EventModel[] = [];

            // Split tasks into future and earlier tasks
            eventRecord.resource.events.forEach((ev: EventModel) => {
                if (ev !== eventRecord) {
                    if (ev.startDate >= eventRecord.startDate) {
                        futureEvents.push(ev);
                    } else {
                        earlierEvents.push(ev);
                    }
                }
            });

            futureEvents.sort((a, b) => a.startDate > b.startDate ? 1 : -1);
            earlierEvents.sort((a, b) => a.startDate > b.startDate ? -1 : 1);

            this.beginBatch();

            futureEvents.forEach((ev: EventModel, i) => {
                const prev = futureEvents[i - 1] || eventRecord;

                ev.startDate = DateHelper.max(prev.endDate as Date, ev.startDate as Date);
            });

            // Walk backwards and remove any overlap
            [ eventRecord, ...earlierEvents ].forEach((ev: EventModel, i, all) => {
                const prev = all[i - 1];

                if ((ev.endDate as Date).getTime() > Date.now() && ev !== eventRecord && prev) {
                    ev.setEndDate(DateHelper.min(prev.startDate as Date, ev.endDate as Date), true);
                }
            });

            this.endBatch();
        }
    }
}
