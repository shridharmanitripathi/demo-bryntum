<!--
 * This is a simple wrapper around Bryntum button
-->
<template><div></div></template>

<script>
    // we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
    import { WidgetHelper } from 'bryntum-scheduler';
    // import { WidgetHelper } from 'bryntum-scheduler/scheduler.umd';

    // export the button
    export default {
        props : {
            text       : { type : String },
            tooltip    : String,
            icon       : String,
            color      : { type : String, default : 'b-orange b-raised' },
            action     : { type : String, default : 'action' },
            toggleable : { type : Boolean }
        },

        mounted() {
            var props = this.$props;

            const button = WidgetHelper.createWidget({
                type       : 'button',
                action     : props.action,
                appendTo   : this.$el,
                color      : props.color,
                icon       : props.icon,
                text       : props.text,
                tooltip    : props.tooltip,
                toggleable : props.toggleable,
                onAction   : ({source}) => {
                    this.$emit('click', source)
                }
            });

            this.button = button;

        } // eo function mounted

    } // eo Button export

</script>

<!-- eof -->
