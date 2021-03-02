/**
 *- Page header component. Contains also controls (tools)
 */

// libraries
import React from 'react';

// our stuff
import { FullscreenButton, Tools } from 'bryntum-react-shared';

const header = props => {
    const
        title = props.title || 'React demo',
        href = props.titleHref || '#';

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>{title}</a>
            </div>
            <Tools>
                <FullscreenButton container='tools'/>
            </Tools>
        </header>
    );

}; // eo function header

export default header;

// eof
