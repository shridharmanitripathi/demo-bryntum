/**
 * Contains scheduler and equipment grid
 */
// libraries
import React, { useEffect, useRef } from 'react';
import { BryntumScheduler, BryntumWidget } from 'bryntum-react-shared';
import scheduler1Config from '../components/scheduler1Config.js';
import scheduler2Config from '../components/scheduler2Config.js';
import BottomScheduler from '../lib/BottomScheduler.js';
// our stuff

const Content = props => {

    const scheduler1Ref = useRef();

    // handles zoom change (props.zoom contains object {action:'zoomIn|Out'} )
    useEffect(() => {
        const
            action = props.zoom && props.zoom.action,
            scheduler1 = scheduler1Ref.current.schedulerInstance;

        if (action) {
            scheduler1[action]();
        }

    }, [props.zoom]);

    return (
        <div id='content'>
            <BryntumScheduler {...scheduler1Config} ref={scheduler1Ref}/>
            <BryntumWidget type="splitter" />
            <BryntumScheduler {...scheduler2Config} schedulerClass={BottomScheduler}/>
        </div>
    );

};

export default Content;
