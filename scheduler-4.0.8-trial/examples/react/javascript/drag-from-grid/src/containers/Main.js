/**
 * Main Component (functional)
 */
// libraries
import React, { Fragment, useRef } from 'react';

// our stuff
import Header from '../components/Header.js';
import Content from './Content.js';

const Main = props => {

    // for a bug/problem in react/scheduler
    // combination we cannot use useState here
    const autoReschedule = useRef(false);

    return (
        <Fragment>
            <Header
                title="Angular Drag from Grid demo"
                titleHref="../../../../#example-react-javascript-drag-from-grid"
                onAutoReschedule={value => autoReschedule.current = value}
            />
            <Content autoReschedule={autoReschedule} />
        </Fragment>
    );

};

export default Main;
