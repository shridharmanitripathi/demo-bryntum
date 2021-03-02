/**
 *- Main App script
 */
// libraries
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

// styles
import 'bryntum-react-shared/resources/shared.scss';
import 'bryntum-scheduler/scheduler.stockholm.css';
import './App.scss';

// locales
import './locales';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { LocaleManager, Toast } from 'bryntum-scheduler';
import { LocaleManager, Toast } from 'bryntum-scheduler/scheduler.umd';

// our stuff
import Main from './containers/Main';
import { loadData, clearError } from './redux/actions/actions';

const App = props => {

    const { t, i18n } = useTranslation();

    /**
     * @param {String} locale Locale to set
     *
     * Sets state and changes language. The function is passed to the
     * global SettingsContext so that it can be called from any even
     * deeply nested components that are consumers of SettingsContext.
     */
    const changeLocale = locale => {

        // change locale in i18next
        i18n.changeLanguage(locale);

        // translate document title
        document.title = t('title');

        // change the scheduler locale
        applySchedulerLocale(locale);
    }; // eo function changeLocale

    /**
     *
     * @param {String} schedulerLocale
     * Applies scheduler locale. Called always when
     * locale changes by SettingContext setLocale
     */
    const applySchedulerLocale = schedulerLocale => {
        switch (schedulerLocale) {
            case 'se':
                LocaleManager.applyLocale('SvSE');
                break;

            case 'ru':
                LocaleManager.applyLocale('Ru');
                break;

            default:
                LocaleManager.applyLocale('En');
                break;
        }
    }; // eo function applySchedulerLocale

    // set the translated document title as soon as we have the locale
    document.title = t('title');

    // set scheduler locale at startup
    applySchedulerLocale(props.locale);

    if (props.locale && (props.locale !== i18n.language)) {
        changeLocale(props.locale);
    }

    // error handler
    useEffect(() => {
        if (props.err) {
            Toast.show(t(props.err.message));
            props.clearError();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.err]);

    return (<Main/>);
}; // eo function app

const mapStateToProps = state => {
    return {
        locale : state.locale,
        err    : state.err
    };
}; // eo function mapStateToProps

const mapDispatchToProps = dispatch => {
    return {
        loadData   : () => dispatch(loadData()),
        clearError : () => dispatch(clearError())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// eof
