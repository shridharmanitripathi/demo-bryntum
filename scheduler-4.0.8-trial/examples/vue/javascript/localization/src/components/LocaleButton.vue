<!--
/**
 * Locale button with menu
 */
-->

<template>
    <div class="btn-group">
        <button
            type           = "button"
            class          = "btn btn-secondary dropdown-toggle dropdown locale"
            data-toggle    = "dropdown"
            aria-haspopup  = "true"
            :aria-expanded = "showLocale"
            @click         = "showLocale = !showLocale"
            @blur          = "onLocaleBlur"
            ref            = "button"
        ><flag
            :squared = "false"
            :iso     = "currentLocale.iso === 'en' ? 'us' : currentLocale.iso"
        />{{ currentLocale.name }}</button>
        <div class="dropdown-menu" :class={show:showLocale}>
            <a
                v-for  = "locale in locales"
                class  = "dropdown-item"
                href   = "#"
                :key   = "locale"
                @click = "onLocaleClick(locale.iso)"
            ><flag
                :squared=false
                :iso="locale.iso === 'en' ? 'us' : locale.iso"
            />{{ locale.name }}
            </a>
        </div>
    </div>
</template>

<script>
    import { Tooltip, LocaleManager } from 'bryntum-scheduler';

    // export LocaleButton
    export default {
        props : ['value'],

        computed : {
            currentLocale() {
                const
                    value = this.localValue,
                    locale = this.locales.find(locale => {
                        return value === locale.iso;
                    })
                ;
                return locale.iso ? Object.assign({}, locale) : { iso : 'en', name : 'English'};
            }, // eo function currentLocale
        }, // eo computed

        data() {
            return {
                showLocale : false,
                locales : [
                    {iso : 'en', name : 'English'},
                    {iso : 'se', name : 'Swedish'},
                    {iso : 'ru', name : 'Russian'}
                ],
                localValue : this.$props.value || 'en',
            } // eo return data
        }, // eo function data

        methods : {
            // change the language to the clicked one
            onLocaleClick(iso) {
                this.$i18n.i18next.changeLanguage(iso);
            }, // eo function onLocaleClick

            // hide the languages menu on blur
            onLocaleBlur() {
                const me = this;
                setTimeout(() => {me.showLocale = false}, 10);
            }, // eo function onLocaleBlur

            // change locale listener. Updates internal value and UI.
            onLocaleChange(lng) {
                // console.log(`onLocaleChange(${lng})`);
                if('en-US' === lng) {
                    this.$i18n.i18next.changeLanguage('en');
                    return;
                }

                if(this.tooltip) {
                    this.tooltip.html = this.$i18n.t('selectLanguage');
                    document.title = this.$i18n.t('title');
                    this.applySchedulerLocale(lng);
                    this.localValue = lng;
                }
            }, // eo function onLocaleChange

            // applies scheduler locale
            applySchedulerLocale(lng) {
                let locale = lng;
                switch (lng) {
                    case 'se' :
                        locale = 'SvSE';
                        break ;

                    case 'ru' :
                        locale = 'Ru';
                        break;

                    default :
                        locale = 'En';
                        break;
                }
                LocaleManager.locale = locale;
            } // eo function applySchedulerLocale
        }, // eo methods

        // run once when component is created
        // installs languageChanged listener on i18next
        created() {
            this.$i18n.i18next.on('languageChanged', this.onLocaleChange);
        }, // eo function created

        // runs once after the component is mounted to DOM
        mounted() {
            this.tooltip = new Tooltip({
                forElement  : this.$refs.button,
                html        : this.$i18n.t('selectLanguage'),
                showOnHover : true
            });
        } // eo function mounted
    } // eo export LocaleButton

</script>

<style scoped>
    .locale {
        border        : none;
        color         : white;
        border-radius : 2px;
        margin-right  : 0.5em;
        min-width     : 8em;
        opacity       : 0.9;
    }
    .locale:focus {
        box-shadow : none;
    }
    .flag-icon {
        margin-right : 0.5em;
    }
    .dropdown-menu {
        box-shadow : 0px 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>

<!-- eof -->
