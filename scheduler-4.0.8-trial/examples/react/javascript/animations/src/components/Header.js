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
import { FullscreenButton, Tools, BryntumWidget } from 'bryntum-react-shared';

const header = props => {
    const
        title = props.title || 'React demo',
        href = props.titleHref || '#'
    ;

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                {/* <DurationSlider onChange={props.onSliderChange} container='tools'/> */}
                <BryntumWidget
                    type="slider"
                    text="Animation duration"
                    min={0}
                    max={3000}
                    value={500}
                    step={200}
                    showValue={false}
                    showTooltip={true}
                    onChange={props.onSliderChange}
                />
                <BryntumWidget
                    type="button"
                    color="b-orange b-raised"
                    text="Max 1hr"
                    onAction={props.onMaxClick}
                    container="tools"
                />
                <BryntumWidget
                    type="button"
                    color="b-orange b-raised"
                    text="Move to after lunch"
                    onAction={props.onMoveClick}
                    container="tools"
                />
                <BryntumWidget
                    type="button"
                    color="b-orange b-raised"
                    text="Random update"
                    onAction={props.onRandomClick}
                    container="tools"
                />
                <FullscreenButton container='tools' />
            </Tools>
        </header>
    );

}; // eo function header

export default header;

// eof
