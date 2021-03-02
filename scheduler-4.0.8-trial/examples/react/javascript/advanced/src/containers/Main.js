/**
 *- Main container with header and content
 */
// libraries
import React, { Fragment } from 'react';

// our stuff
import Header from '../components/header/Header.js';
import Content from './Content.js';

const main = props => {
    return (
        <Fragment>
            <Header
                titleHref='../../../../#example-react-javascript-advanced'
            />
            <Content />
        </Fragment>
    )
} // eo function main

export default main;

// eof
