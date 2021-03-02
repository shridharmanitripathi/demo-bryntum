/**
 * Page header container component
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
        title  = props.title || document.title || '',
        href   = props.titleHref || '#',
        onZoom = ({source}) => {
            if(props.onZoom) {
                props.onZoom(source.dataset.action);
            }
        }
    ;

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                <BryntumWidget
                    type      = "button"
                    dataset   = {{ action:'zoomIn' }}
                    cls       = "b-raised"
                    color     = "b-orange"
                    icon      = "b-icon b-icon-search-plus"
                    tooltip   = "Zoom in"
                    onAction  = { onZoom }
                    container = "tools"
                />
                <BryntumWidget
                    type      = "button"
                    dataset   = {{ action:'zoomOut' }}
                    cls       = "b-raised"
                    color     = "b-orange"
                    icon      = "b-icon b-icon-search-minus"
                    tooltip   = "Zoom out"
                    onAction  = { onZoom }
                    container = "tools"
                />
                <FullscreenButton container='tools' />
            </Tools>
        </header>
    );
};

export default header;
