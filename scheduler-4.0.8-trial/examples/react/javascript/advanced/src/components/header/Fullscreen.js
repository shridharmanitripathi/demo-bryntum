/**
 *- Fullscreen button
 *
 * If a container is passed in props then it
 * appends itself to that container. Otherwise it creates a
 * div and renders into that div.
 */
// libraries
import React, { useRef, useEffect } from 'react';
// we import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Fullscreen, WidgetHelper } from 'bryntum-scheduler';
import { Fullscreen, WidgetHelper } from 'bryntum-scheduler/scheduler.umd';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const Button = props => {

    // refs and t function
    const
        elRef = useRef(),
        buttonRef = useRef(),
        { t } = useTranslation();

    // Bryntum button instance
    const button = buttonRef.current = buttonRef.current || (Fullscreen.enabled ? WidgetHelper.createWidget({
        type       : 'button',
        id         : 'fullscreen-button',
        icon       : 'b-icon b-icon-fullscreen',
        tooltip    : t('fullscreen'),
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
    }) : null);

    // runs once on mounting – initialization
    useEffect(() => {
        if (button) {
            Fullscreen.onFullscreenChange(() => {
                button.pressed = Fullscreen.isFullscreen;
            });

            button.appendTo = props.container || elRef.current;
            if (!props.skipRender) {
                button.render();
            }
        }

        return () => {
            if (button) {
                Fullscreen.onFullscreenChange(null);
            }
        };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // runs on locale change – translates tooltip
    useEffect(() => {
        if (button) {
            button.tooltip = t('fullscreen');
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.locale]);

    // container for the button
    return props.container ? null : <div ref={elRef}></div>;

}; // eo function button

// maps Redux state to this button props
const mapStateToProps = state => {
    return {
        locale : state.locale
    };
};

// connects to Redux and exports the button
export default connect(mapStateToProps)(Button);

// eof
