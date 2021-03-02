<template>
    <header class="app-header">
        <h1><a id="title" href="../../../../#example-vue-typescript-drag-onto-tasks">Vue Drag-Onto-Tasks</a></h1>
    </header>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";

    @Component
    export default class AppHeader extends Vue {

    }
</script>

<style lang="scss">
    .app-header {
        padding             : 1.5em .5em 1.5em 4em;
        background          : url(../../../../../_shared/images/logo_bryntum_bw.png) #2196F3;
        background-repeat   : no-repeat;
        background-size     : 30px;
        background-position : center left 1.5em;
        display             : flex;

        h1 {
            margin      : 0;
            font-size   : 1.5em;
            color       : #fff;
            font-weight : normal;
            flex        : 1;
            align-self  : center;
        }

        a {
            color           : inherit;
            text-decoration : none;
        }
    }
</style>
