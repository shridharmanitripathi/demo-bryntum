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
import { FullscreenButton, Tools } from 'bryntum-react-shared';

// our stuff
import LocaleCombo from './LocaleCombo.js';

const header = props => {
    const
        title = props.title || document.title || '',
        href = props.titleHref || '#';

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                <LocaleCombo container='tools'/>
                <FullscreenButton container='tools'/>
            </Tools>
        </header>
    );
}; // eo function header

export default header;

// eof
