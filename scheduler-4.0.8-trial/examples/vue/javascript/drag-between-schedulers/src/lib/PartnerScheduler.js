/**
 *- Implements custom partner property setter
 */
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
import { Scheduler } from 'bryntum-scheduler';
// import { Scheduler } from 'bryntum-scheduler/scheduler.umd';

class PartnerScheduler extends Scheduler {
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
    } // eo partner setter

    /**
     * Proxy to parent getter
     */
    get partner() {
        return super.partner;
    } // eo partner getter

}

export default PartnerScheduler;

// eof
