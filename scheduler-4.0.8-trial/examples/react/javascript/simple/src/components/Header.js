/**
 * Demo header implementation
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import { Tools, FullscreenButton, BryntumWidget } from 'bryntum-react-shared';

import Selected from './Selected';

const Header = props => {
    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={props.titleHref}>
                    {props.title || document.title}
                </a>
            </div>
            <Tools>
                <Selected
                    selectedEvent={props.selectedEvent}
                    container="tools"
                />
                <BryntumWidget
                    type="button"
                    color="b-green b-raised"
                    icon="b-fa b-fa-plus"
                    onClick={props.onAddClick}
                    container="tools"
                />
                <BryntumWidget
                    type="button"
                    color="b-red b-raised"
                    icon="b-fa b-fa-trash"
                    onClick={props.onRemoveClick}
                    disabled={!props.selectedEvent}
                    container="tools"
                />
                <BryntumWidget
                    type="numberfield"
                    label="Bar Margin:"
                    width={160}
                    min={0}
                    max={15}
                    step={1}
                    value={props.barMargin}
                    onChange={({ value }) => props.onBarMarginChange(value)}
                />
                <FullscreenButton container="tools" />
            </Tools>
        </header>
    );
};

Header.propTypes = {
    barMargin: PropTypes.number.isRequired,
    title: PropTypes.string,
    titleHref: PropTypes.string.isRequired,
    selectedEvent: PropTypes.string.isRequired,

    // callbacks
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onBarMarginChange: PropTypes.func.isRequired
};

export default Header;
