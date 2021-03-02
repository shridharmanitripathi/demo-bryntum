/**
 *- Page header container component
 *
 * It contains also controls (tools).
 * It is implemented as a functional component using React hooks that
 * were introduced in React 16.8.0. If you cannot upgrade to that or
 * later version of React then you must convert this component to class.
 */
// libraries
import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

// our stuff (buttons)
import LocaleCombo from './LocaleCombo.js';
import Reload from './Reload.js';
import ZoomIn from './ZoomIn.js';
import ZoomOut from './ZoomOut.js';
import { Tools } from 'bryntum-react-shared';
import FullscreenButton from './Fullscreen.js';

const Header = props => {
    const
        href = props.titleHref || '#',
        { t } = useTranslation()
    ;

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{t('title')}</a>
            </div>
            <Tools>
                <LocaleCombo container='tools'/>
                <Reload container='tools'/>
                <ZoomOut container='tools'/>
                <ZoomIn container='tools'/>
                <FullscreenButton container='tools' />
            </Tools>
        </header>
    );

}; // eo function header

// maps Redux state to this button props
const mapStateToProps = state => {
    return {
        locale : state.locale
    };
};

// connects to Redux and exports the button
export default connect(mapStateToProps)(Header);

// eof
