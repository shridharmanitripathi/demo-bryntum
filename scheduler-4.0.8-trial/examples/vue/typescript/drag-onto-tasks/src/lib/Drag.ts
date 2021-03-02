import { DragHelper, WidgetHelper, Grid, Scheduler } from "bryntum-scheduler";

export default class Drag extends DragHelper {
    private grid: Grid;
    private schedule: Scheduler;

    static get defaultConfig() {
        return {
            // Don"t drag the actual cell element, clone it
            cloneTarget        : true,
            mode               : "translateXY",
            // Only allow drops on scheduled tasks
            dropTargetSelector : ".b-sch-event",

            // Only allow dragging cell elements inside on the equipment grid
            targetSelector : ".b-grid-cell"
        };
    }

    public construct(config: any) {
        const me = this;

        super.construct(config);

        me.on({
            dragstart : me.onEquipmentDragStart,
            drop      : me.onEquipmentDrop,
            thisObj   : me
        });
    }

    public onEquipmentDragStart({ context }: { context: any }) {
        // save a reference to the equipment so we can access it later
        context.equipment = this.grid.getRecordFromElement(context.grabbed);

        // Prevent tooltips from showing while dragging
        this.schedule.element.classList.add("b-dragging-event");
    }

    public onEquipmentDrop({ context }: { context: any }) {
        const me = this;

        if (context.valid) {
            const equipment = context.equipment;
            const eventRecord = me.schedule.resolveEventRecord(context.target) as any;

            eventRecord.equipment = eventRecord.equipment.concat(equipment);

            context.finalize();

            // Dropped on a scheduled event, display toast
            WidgetHelper.toast(`Added ${equipment.name} to ${eventRecord.name}`);
        }

        me.schedule.element.classList.remove("b-dragging-event");
    }
}
