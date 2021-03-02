/**
 * Implements custom partner property setter
 */
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Scheduler } from 'bryntum-scheduler';
import { Scheduler } from 'bryntum-scheduler/scheduler.umd';

class BottomScheduler extends Scheduler {

    /**
     * Original class name getter. See Widget.$name docs for the details.
     * @return {string}
     */
    static get $name() {
        return 'BottomScheduler';
    }

    /**
     * @param {Scheduler|String} partner Other scheduler instance or id
     * Setter now accepts string id and attempts to find the instance in that case
     */
    set partner(partner) {
        // eslint-disable-next-line no-undef
        const partnerInstance = 'string' === typeof partner ? bryntum.get(partner) : partner;
        if (partnerInstance) {
            super.partner = partnerInstance;
        }
    }

    /**
     * Proxy to parent getter
     */
    get partner() {
        return super.partner;
    }
}

export default BottomScheduler;
