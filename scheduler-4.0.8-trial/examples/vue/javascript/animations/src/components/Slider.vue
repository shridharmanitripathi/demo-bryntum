<!--
 * Simple wrapper of Bryntum slider
-->
<template><div class="slider"></div></template>

<script>
    import { WidgetHelper, FunctionHelper } from 'bryntum-scheduler';
    import { eventBus } from '../main';

    export default {
        props : {
            text : {type : String, default : 'Slider'}
        },

        mounted() {
            var props = this.$props;

            const button = WidgetHelper.createWidget({
                type        : 'slider',
                appendTo    : this.$el,
                text        : props.text,
                min         : 0,
                max         : 3000,
                value       : 600,
                step        : 200,
                showValue   : false,
                showTooltip : true,
                onChange    : FunctionHelper.createBuffered(
                    ({value}) => eventBus.$emit('duration', value), 200
                )
            });

        } // eo function mounted

    } // eo Button export
</script>

<!-- eof -->
