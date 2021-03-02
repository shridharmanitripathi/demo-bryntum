<!--
 * Tasks component
 -->

<template>
    <div class="home">
        <scheduler
            ref="tasks"
            :config="tasksConfig"
        />
    </div>
</template>

<script>
    import tasksConfig from '@/components/scheduler/tasksConfig';
    import Scheduler from 'bryntum-vue-shared/src/Scheduler.vue';
    import { ResourceModel } from 'bryntum-scheduler';

    // The data for this demo (data/data.json) uses the 'clients' property to hold children of resources
    ResourceModel.childrenField = 'clients';

    export default {
        data() {
            return {
                tasksConfig
            }
        },
        components : {
            Scheduler
        }
    } // eo export default
</script>

<!-- eof -->
