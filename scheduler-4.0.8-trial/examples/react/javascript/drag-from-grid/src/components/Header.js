/**
 * Page header component. Contains also controls.
 */
// libraries
import React from 'react';

// our stuff
import { FullscreenButton, Tools, BryntumWidget } from 'bryntum-react-shared';

const header = props => {
    const title = props.title || 'React demo';
    const href = props.titleHref || '#';

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                <BryntumWidget
                    type       = "button"
                    toggleable = { true }
                    color      = "b-blue b-raised"
                    icon       = "b-fa b-fa-calendar"
                    tooltip    = "Toggles whether to automatically reschedule overlapping tasks"
                    cls        = "reschedule-button"
                    onClick    = { ({ source : button }) => {
                        props.onAutoReschedule(button.pressed);
                    }}
                    container = "tools"
                />
                <FullscreenButton container='tools'/>
            </Tools>
        </header>
    );

};

export default header;
