/**
 * Header file
 */
import React from 'react';
import { Tools, FullscreenButton } from 'bryntum-react-shared';

const header = () => {

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href="../../../../#example-react-typescript-recurring-events">React + TypeScript Recurring Events demo</a>
            </div>
            <Tools>
                <FullscreenButton container="tools"></FullscreenButton>
            </Tools>

        </header>
    );
}

export default header
