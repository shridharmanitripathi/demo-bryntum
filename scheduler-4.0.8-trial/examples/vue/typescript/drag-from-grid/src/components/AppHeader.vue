<template>
    <header class="app-header">
        <h1><a id="title" href="../../../../#example-vue-typescript-drag-from-grid">Vue Drag-From-Grid</a></h1>
        <button @click="onClick"><i class="b-fa b-fa-calendar"></i>Auto-reschedule</button>
    </header>
</template>

<script lang="ts">
    import { Component, Emit, Vue } from "vue-property-decorator";

    @Component
    export default class AppHeder extends Vue {
        @Emit("click")
        private onClick(event: Event): HTMLButtonElement {
            const button = event.target && (event.target as HTMLElement).closest("button");
            if (button) {
                button.classList.toggle("pressed");
                button.firstElementChild!.classList.toggle("b-fa-calendar");
                button.firstElementChild!.classList.toggle("b-fa-calendar-check");
            }
            return button!;
        }
    }
</script>

<style>
    .app-header {
        padding             : 1.5em .5em 1.5em 4em;
        background          : url(../../../../../_shared/images/logo_bryntum_bw.png) #2196F3;
        background-repeat   : no-repeat;
        background-size     : 30px;
        background-position : center left 1.5em;
        display             : flex;
    }

    .app-header h1 {
        margin      : 0;
        font-size   : 1.5em;
        color       : #fff;
        font-weight : normal;
        flex        : 1;
        align-self  : center;
    }

    .app-header a {
        color           : inherit;
        text-decoration : none;
    }

    .app-header button {
        background    : #8BC34A;
        border        : none;
        color         : #fff;
        cursor        : pointer;
        font-size     : 1em;
        font-family   : "Source Sans Pro", "Helvetica Neue", Helvetica, sans-serif;
        border-radius : 2px;
        margin-right  : .5em;
    }

    .app-header button i {
        margin-right : .5em;
    }

    .app-header button.pressed {
        background : #425c23;
    }

    .app-header button:not(.pressed):hover {
        background : #9CCC65;
    }

    .app-header button:not(.pressed):active {
        background : #9CCC65;
    }
</style>
