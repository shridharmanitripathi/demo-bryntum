/**
 *- Main component
 */
// libraries
import React, { Component, Fragment } from 'react';
import {BryntumScheduler} from 'bryntum-react-shared';
import {StringHelper} from 'bryntum-scheduler/scheduler.umd';

// our stuff
import Header from '../components/Header.js';
class Main extends Component {
    render() {
        const eventRenderer = ({eventRecord, resourceRecord, renderData}) => {
            const bgColor = resourceRecord.bg || '';

            renderData.style = `background:${bgColor};border-color:${bgColor};color:${resourceRecord.textColor}`;
            renderData.iconCls.add('b-fa', `b-fa-${resourceRecord.icon}`);

            return StringHelper.encodeHtml(eventRecord.name);
        }; // eo function eventRenderer

        return (
            <Fragment>
                <Header
                    title="React Dependencies demo"
                    titleHref="../../../../#example-react-javascript-dependencies"
                />
                <BryntumScheduler
                    ref        = {'scheduler'}
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
                    dependencyEditFeature = {{
                        showLagField : false
                    }}
                    timeRangesFeature   = {true}
                    eventDragFeature    = {{
                        constrainDragToResource : true
                    }}
                    crudManager = {{
                        autoLoad  : true,
                        transport : {
                            load : {
                                url : 'data/data.json'
                            }
                        }
                    }}

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

                />
            </Fragment>
        );
    }
} // eo class Main

export default Main;

// eof
