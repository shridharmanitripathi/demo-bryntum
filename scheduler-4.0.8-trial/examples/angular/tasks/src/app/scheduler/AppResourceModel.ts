// Bryntum umd lite bundle comes without polyfills to support Angular's zone.js
import { ResourceModel, ResourceModelConfig } from 'bryntum-scheduler/scheduler.lite.umd.js';

export type AppResourceModelConfig = ResourceModelConfig & {
    color: string;
};

export class AppResourceModel extends ResourceModel {

    color: string;

    constructor(config?: Partial<AppResourceModelConfig>) {
        super(config);
    }

    static get fields() {
        return [
            { name : 'color', defaultValue : 'blue' }
        ];
    }
}
