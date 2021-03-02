/**
 * Main component
 */
// libraries
import React, { Fragment } from 'react';
import Header from '../components/Header.js';
import 'bryntum-scheduler/scheduler.stockholm.css';
import Content from './Content.js';
// our stuff

const main = props => {

    return (
        <Fragment>
            <Header
                titleHref='../../../../#example-react-javascript-drag-onto-tasks'
            />
            <Content/>
        </Fragment>
    );
};

export default main;
