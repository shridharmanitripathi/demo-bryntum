<!--
/**
 * Header with title and buttons
 */
-->

<template>
    <header class="app-header">
        <h1><a id="title" :href="link">{{ $props.title }}</a></h1>
        <app-slider text="Animation duration"></app-slider>
        <app-button text="Max 1hr" action="max"></app-button>
        <app-button text="Move to after lunch" action="move"></app-button>
        <app-button text="Random update" action="random"></app-button>
        <fullscreen-button></fullscreen-button>
    </header>
</template>

<script>
    import FullscreenButton from 'bryntum-vue-shared/src/FullscreenButton.vue';
    import AppButton from './Button.vue';
    import AppSlider from './Slider.vue'

    export default {
        name  : 'app-header',
        props : {
            link  : { type : String, default : '..' },
            title : { type : String, default : 'Example Header' }
        },
        components: {
            FullscreenButton,
            AppButton,
            AppSlider
        },
        mounted() {
            document.title = this.$props.title;
        }

    } // exports the header components
</script>

<style>
    .app-header {
        padding             : 2.1em .5em 2.1em 5em;
        background          : url(~bryntum-resources/images/logo_bryntum_bw.png) #2667c8;
        background-repeat   : no-repeat;
        background-size     : 40px;
        background-position : center left 1.5em;
        display             : flex;
    }

    .app-header h1 {
        margin      : 0;
        font-size   : 1.8em;
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

    .app-header button:hover {
        background : #9CCC65;
    }

    .app-header button:active {
        background : #9CCC65;
    }

    .app-header button:disabled {
        background : #ccbdb8 !important;
        cursor     : default;
    }

    .app-header button.red {
        background : #F44336;
    }

    .app-header button.red:hover {
        background : #EF5350;
    }

    .app-header .slider {
        margin-right : 1em;
        color        : white;
    }
</style>

<!-- eof -->
