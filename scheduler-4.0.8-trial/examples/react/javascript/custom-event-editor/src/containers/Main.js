/**
 *- Implements the top level Main container
 */
// libraries
import React, { Component } from 'react';
import { BryntumScheduler } from 'bryntum-react-shared';

// our stuff
import Header from '../components/Header.js';

class Main extends Component {
  /**
   * render method
   */
  render = () => {
    return (
      <React.Fragment>
        <Header
            titleHref='../../../../#example-react-javascript-custom-event-editor'
        />
        <BryntumScheduler
          ref={'scheduler'}
          barMargin={5}
          startDate={new Date(2017, 1, 7, 8)}
          endDate={new Date(2017, 1, 7, 18)}
          crudManager={{
            autoLoad: true,
            transport: {
              load: {
                url: 'data/data.json'
              }
            }
          }}
          listeners={{
            beforeEventEdit: source => {
              source.eventRecord.resourceId =
                source.resourceRecord.id;
              this.props.showEditor(source.eventRecord);
              return false;
            }
          }}
          resourceImagePath='users/'
            // Columns in scheduler
          columns={[
            {
              type: 'resourceInfo',
              text: 'Staff',
              width: 180
            },
            {
              text: 'Type',
              field: 'category',
              width: 100
            }
          ]}
        />{' '}
        {/* eo BryntumScheduler */}
      </React.Fragment>
    );
  }; // eo function render
} // eo class Main

export default Main;

// eof
