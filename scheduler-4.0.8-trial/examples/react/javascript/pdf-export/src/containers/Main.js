/**
 *- App component (functional)
 */

// libraries
import React, { Fragment, useRef } from 'react';
import {BryntumScheduler} from 'bryntum-react-shared';

// our stuff
import Header from '../components/Header.js';
import 'bryntum-scheduler/scheduler.stockholm.css';

const App = props => {
    // eslint-disable-next-line
    const scheduler = useRef(null);

    const eventRenderer = ({eventRecord, resourceRecord, renderData}) => {

        const bgColor = resourceRecord.bg || '';

        renderData.style = `background:${bgColor};border-color:${bgColor};color:${resourceRecord.textColor}`;
        renderData.iconCls = `b-fa b-fa-${resourceRecord.icon}`;

        return eventRecord.name;
    }; // eo function eventRenderer

    const onExportClick = () => {
        scheduler.current.schedulerInstance.features.pdfExport.showExportDialog();
    };

    return (
        <Fragment>
            <Header onExportClick={onExportClick} />
            <BryntumScheduler
                ref        = {scheduler}
                minHeight  = '20em'
                eventStyle = {null}
                eventColor = {null}
                rowHeight  = {50}
                barMargin  = {8}

                startDate = {new Date(2017, 11, 1)}
                endDate   = {new Date(2017, 11, 3)}

                columns = {[
                    {
                        text  : 'Production line',
                        width : 150,
                        field : 'name'
                    }
                ]}
                stripeFeature       = {true}
                dependenciesFeature = {true}
                timeRangesFeature   = {true}
                eventDragFeature    = {{
                    constrainDragToResource : true
                }}
                pdfExportFeature    = {{
                    exportServer            : 'http://localhost:8080',
                    // Development config
                    translateURLsToAbsolute : 'http://localhost:3000',
                    clientURL               : 'http://localhost:3000',
                    // For production replace with this one. See README.md for explanation
                    // translateURLsToAbsolute : 'http://localhost:8080/resources/', // Trailing slash is important

                    keepPathName : false
                }}
                crudManager = {{
                    autoLoad  : true,
                    transport : {
                        load : {
                            url : 'data/data.json'
                        }
                    }
                }} // eo crudManager

                viewPreset = {{
                    base           : 'hourAndDay',
                    tickWidth      : 25,
                    columnLinesFor : 0,
                    headers        : [
                        {
                            unit       : 'd',
                            align      : 'center',
                            dateFormat : 'ddd DD MMM'
                        },
                        {
                            unit       : 'h',
                            align      : 'center',
                            dateFormat : 'HH'
                        }
                    ]
                }}
                eventRenderer = {eventRenderer}

            /> {/* eo BryntumScheduler */}
        </Fragment>
    );
} // eo class Main

export default App;

// eof
