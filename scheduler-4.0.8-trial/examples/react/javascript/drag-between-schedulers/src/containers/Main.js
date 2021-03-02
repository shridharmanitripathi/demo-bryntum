/**
 * Main Component (functional)
 */
// libraries
import React, { Fragment, useState } from 'react';
import Header from '../components/Header.js';
import 'bryntum-scheduler/scheduler.stockholm.css';
import Content from './Content.js';

const Main = props => {

    const
        [zoom, setZoom] = useState(null),
        onZoom = (action) => {
            setZoom({ action : action });
        };

    return (
        <Fragment>
            <Header
                titleHref='../../../../#example-react-javascript-drag-between-schedulers'
                onZoom={onZoom}
            />
            <Content zoom={zoom}/>
        </Fragment>
    );
};

export default Main;
