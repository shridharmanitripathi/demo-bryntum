/**
 *- Main component
 */
// libraries
import React, { Fragment } from 'react';

// our stuff
import Header from '../components/Header.js';
import Content from './Content.js';

const main = props => {

    return (
        <Fragment>
            <Header
                titleHref='../../../../#example-react-javascript-localization'
            />
            <Content/>
        </Fragment>
    );
}; // eo function main

export default main;

// eof
