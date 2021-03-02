/**
 *- React Fullscreen button wrapper
 *
 * If container is passed in props then it
 * appends itself to that container. Otherwise it creates a
 * div and renders into that div.
 */
// libraries
import React, { Component } from 'react';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Fullscreen, WidgetHelper } from 'bryntum-scheduler';
import { Fullscreen, WidgetHelper } from 'bryntum-scheduler/scheduler.umd';

export default class FullscreenButton extends Component {

    /**
     * Configure and render Fullscreen button
     */
    componentDidMount() {

        const button = Fullscreen.enabled ? WidgetHelper.createWidget({
            type       : 'button',
            id         : 'fullscreen-button',
            icon       : 'b-icon-fullscreen',
            tooltip    : 'Fullscreen',
            toggleable : true,
            cls        : 'b-tool',
            onToggle   : ({ pressed }) => {
                if (pressed) {
                    Fullscreen.request(document.documentElement);
                }
                else {
                    Fullscreen.exit();
                }
            }
        }) : null; // eo function button

        if (button) {
            Fullscreen.onFullscreenChange(() => {
                this.button.pressed = Fullscreen.isFullscreen;
            });

            button.appendTo = this.props.container || this.el;
            if (!this.props.skipRender) {
                button.render();
            }

            this.button = button;
        }

    } // eo function componentDidMount

    /**
     * Cleanup
     */
    componentWillUnmount() {
        if (this.button) {
            Fullscreen.onFullscreenChange(null);
        }
    } // eo function componentWillUnmount

    render() {
        return this.props.container ? null : <div ref={el => this.el = el}></div>;
    }
} // eo class FullscreenButton

// eof
