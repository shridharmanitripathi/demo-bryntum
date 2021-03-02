/**
 *- Header file
 */
import React from 'react';
import { Tools, FullscreenButton, BryntumWidget } from 'bryntum-react-shared';

const header = (props : {onFilterChange : Function, onHighlightChange : Function}) => {

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href="../../../../#example-react-typescript-filtering">React + TypeScript filtering demo</a>
            </div>
            <Tools>
                <BryntumWidget
                    type                 = "textfield"
                    placeholder          = "Find tasks by name"
                    keyStrokeChangeDelay = {80}
                    listeners            = {{ change : props.onFilterChange }}
                    clearable            = {true}
                    width                = "12.5em"
                    triggers             = {{
                        filter : {
                            align : 'start',
                            cls   : 'b-fa b-fa-filter'
                        }
                    }}
                    container = "tools"
                ></BryntumWidget>
                <BryntumWidget
                    type                 = "textfield"
                    placeholder          = "Highlight tasks"
                    keyStrokeChangeDelay = {80}
                    listeners            = {{ change : props.onHighlightChange }}
                    clearable            = {true}
                    width                = "11em"
                    triggers             = {{
                        filter : {
                            align : 'start',
                            cls   : 'b-fa b-fa-search'
                        }
                    }}
                    container = "tools"
                ></BryntumWidget>
                <FullscreenButton container="tools"></FullscreenButton>
            </Tools>

        </header>
    );
}

export default header
