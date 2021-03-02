/**
 * React Scheduler wrapper
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// We import scheduler.umd for IE11 compatibility only. If you don't use IE import:
// import { Scheduler, ObjectHelper, Widget } from 'bryntum-scheduler';
import { Scheduler, ObjectHelper, Widget } from 'bryntum-scheduler/scheduler.umd';

// Defines a React component that wraps Bryntum Scheduler
class BryntumScheduler extends Component {

    /**
     * @deprecated in favor of schedulerInstance
     */
    get schedulerEngine() {
        console.warn('schedulerEngine is deprecated. Use schedulerInstance instead.')
        return this.schedulerInstance;
    }

    // Defaults for scheduler the scheduler wrapper
    static defaultProps = {
        viewPreset : 'hourAndDay',
        barMargin  : 2,
        /**
         * The number of React portals equals the scrolling buffer size
         * if set to true. The unused portals are removed from memory and DOM
         * at the cost of rendering performances (scrolling speed).
         * If set to false (default) the portals and their elements are kept
         * in memory and DOM.
         * @config {Boolean}
         * @default
         */
        discardPortals: false
    };

    featureRe = /Feature$/;

    /* #region Features */
    features = [
        'cellEditFeature',
        'cellMenuFeature',
        'cellTooltipFeature',
        'columnDragToolbarFeature',
        'columnLinesFeature',
        'columnPickerFeature',
        'columnReorderFeature',
        'columnResizeFeature',
        'dependenciesFeature',
        'dependencyEditFeature',
        'eventDragCreateFeature',
        'eventDragFeature',
        'eventDragSelectFeature',
        'eventEditFeature',
        'eventFilterFeature',
        'eventMenuFeature',
        'eventResizeFeature',
        'eventTooltipFeature',
        'filterBarFeature',
        'filterFeature',
        'groupFeature',
        'groupSummaryFeature',
        'headerMenuFeature',
        'headerZoomFeature',
        'labelsFeature',
        'nonWorkingTimeFeature',
        'panFeature',
        'pdfExportFeature',
        'quickFindFeature',
        'regionResizeFeature',
        'resourceTimeRangesFeature',
        'rowReorderFeature',
        'scheduleMenuFeature',
        'scheduleTooltipFeature',
        'searchFeature',
        'simpleEventEditFeature',
        'sortFeature',
        'stripeFeature',
        'summaryFeature',
        'timeAxisHeaderMenuFeature',
        'timeRangesFeature',
        'treeFeature'
    ];
    /* #endregion */

    /* #region Configs */
    configs = [
        'allowOverlap',
        'animateRemovingRows',
        'assignments',
        'assignmentStore',
        'autoAdjustTimeAxis',
        'autoHeight',
        'barMargin',
        'columnLines',
        'columns',
        'contextMenuTriggerEvent',
        'createEventOnDblClick',
        'crudManager',
        'defaultResourceImageName',
        'dependencyStore',
        'disableGridRowModelWarning',
        'displayDateFormat',
        'emptyText',
        'enableDeleteKey',
        'enableEventAnimations',
        'enableRecurringEvents',
        'enableTextSelection',
        'endDate',
        'endParamName',
        'eventBarTextField',
        'eventBodyTemplate',
        'eventColor',
        'eventLayout',
        'eventRenderer',
        'events',
        'eventSelectionDisabled',
        'eventStore',
        'eventStyle',
        'fillLastColumn',
        'fillTicks',
        'fullRowRefresh',
        'hasVisibleEvents',
        'height',
        'hideHeaders',
        'horizontalEventSorterFn',
        'loadMask',
        'longPressTime',
        'maintainSelectionOnDatasetChange',
        'managedEventSizing',
        'maxHeight',
        'maxWidth',
        'maxZoomLevel',
        'milestoneAlign',
        'milestoneCharWidth',
        'milestoneLayoutMode',
        'minHeight',
        'minWidth',
        'minZoomLevel',
        'mode',
        'multiEventSelect',
        'partner',
        'passStartEndParameters',
        'presets',
        'readOnly',
        'removeUnassignedEvent',
        'resizeToFitIncludesHeader',
        'resourceColumns',
        'resourceImagePath',
        'resourceMargin',
        'resources',
        'resourceStore',
        'resourceTimeRanges',
        'responsiveLevels',
        'rowHeight',
        'scrollLeft',
        'scrollTop',
        'selectedEvents',
        'selectionMode',
        'showDirty',
        'snap',
        'snapRelativeToEventStartDate',
        'startDate',
        'startParamName',
        'subGridConfigs',
        'tickWidth',
        'timeRanges',
        'timeResolution',
        'triggerSelectionChangeOnRemove',
        'useInitialAnimation',
        'viewportCenterDate',
        'viewPreset',
        'weekStartDay',
        'width',
        'workingTime',
        'zoomLevel',
        'zoomOnMouseWheel',
        'zoomOnTimeAxisDoubleClick'
    ];
    /* #endregion */

    state = {
        portals: new Set(),
        // Needed to trigger refresh when portals change
        generation: 0
    };

    /**
     * Removes the unused portal (if discardPortals prop is true) or
     * hides the unused portal (if discardPortals is falsie - default)
     * @param {HTMLElement} cellElement
     * @private
     */
    releaseReactCell(cellElement) {
        const { _domData: cellElementData, _domData: { portalHolder }} = cellElement;

        // Cell already has a react component in it; hide it or remove it
        if (portalHolder) {
            // Remove portal and its element
            if (this.props.discardPortals) {
                const { state, portalHolderMap } = this;

                // Remove React portal
                state.portals.delete(portalHolder.portal);

                // Remove portalHolder from both map and DOM
                portalHolderMap.delete(portalHolder.portal.key);
                portalHolder.remove();
                cellElementData.portalHolder = null;

                // Update state so that React knows something changed
                this.setState({ generation: state.generation++ });
            } else {
                // Hide the portal
                portalHolder.style.display = 'none';
            }
        }
    }

    // React component rendered to DOM, render scheduler to it
    componentDidMount() {
        const
            { props } = this,
            config = {
                // Use this element as our encapsulating element
                adopt           : this.el,
                callOnFunctions : true,
                features        : {},

                // Hook called by engine when requesting a cell editor
                processCellEditor : ({ editor, field }) => {
                    // String etc handled by feature, only care about fns returning React components here
                    if (typeof editor !== 'function') {
                        return;
                    }

                    // Wrap React editor in an empty widget, to match expectations from CellEdit/Editor and make alignment
                    // etc. work out of the box
                    const wrapperWidget = new Widget({
                        name : field // For editor to be hooked up to field correctly
                    });

                    // Ref for accessing the React editor later
                    wrapperWidget.reactRef = React.createRef();

                    // column.editor is expected to be a function returning a React component (can be JSX). Function is
                    // called with the ref from above, it has to be used as the ref for the editor to wire things up
                    const reactComponent = editor(wrapperWidget.reactRef);
                    if (reactComponent.$$typeof !== Symbol.for('react.element')) {
                        throw new Error('Expect a React element');
                    }

                    let editorValidityChecked = false;

                    // Add getter/setter for value on the wrapper, relaying to getValue()/setValue() on the React editor
                    Object.defineProperty(wrapperWidget, 'value', {
                        enumerable : true,
                        get        : function() {
                            return wrapperWidget.reactRef.current.getValue();
                        },
                        set        : function(value) {
                            const component = wrapperWidget.reactRef.current;

                            if (!editorValidityChecked) {
                                const misses = ['setValue', 'getValue', 'isValid', 'focus'].filter(fn => !(fn in component));

                                if (misses.length) {
                                    throw new Error(`
                                        Missing function${misses.length > 1 ? 's' : ''} ${misses.join(', ')} in ${component.constructor.name}.
                                        Cell editors must implement setValue, getValue, isValid and focus
                                    `);
                                }

                                editorValidityChecked = true;
                            }

                            const context = wrapperWidget.owner.cellEditorContext;
                            component.setValue(value, context);
                        }
                    });

                    // Add getter for isValid to the wrapper, mapping to isValid() on the React editor
                    Object.defineProperty(wrapperWidget, 'isValid', {
                        enumerable : true,
                        get        : function() {
                            return wrapperWidget.reactRef.current.isValid();
                        }
                    });

                    // Override widgets focus handling, relaying it to focus() on the React editor
                    wrapperWidget.focus = () => {
                        wrapperWidget.reactRef.current.focus && wrapperWidget.reactRef.current.focus();
                    };

                    // Create a portal, making the React editor belong to the React tree although displayed in a Widget
                    const portal = ReactDOM.createPortal(reactComponent, wrapperWidget.element);
                    wrapperWidget.reactPortal = portal;

                    const { state } = this;
                    // Store portal in state to let React keep track of it (inserted into the Grid component)
                    state.portals.add(portal);
                    this.setState({
                        portals    : state.portals,
                        generation : state.generation + 1
                    });

                    return { editor : wrapperWidget };
                },

                // Hook called by engine when rendering cells, creates portals for JSX supplied by renderers
                processCellContent: ({
                    cellContent,
                    cellElement,
                    cellElementData,
                    record
                }) => {
                    let shouldSetContent = cellContent != null;

                    // Release any existing React component (remove or hide)
                    this.releaseReactCell(cellElement);

                    // Detect React component
                    if (
                        cellContent &&
                        cellContent.$$typeof === Symbol.for('react.element')
                    ) {
                        // Excluding special rows for now to keep renderers simpler
                        if (!record.meta.specialRow) {
                            const { state, portalHolderMap } = this,
                                  portalId = `portal-${record.id}-${cellElementData.columnId}`;
                            // Get already existing portal holder, exists if cell was previously rendered
                            let existingPortalHolder = portalHolderMap.get(
                                portalId
                            );

                            // Record changed, we need a new portal
                            if (
                                existingPortalHolder &&
                                record.generation !==
                                    existingPortalHolder.generation
                            ) {
                                // Remove the old
                                state.portals.delete(
                                    existingPortalHolder.portal
                                );

                                this.setState({
                                    generation: state.generation++
                                });

                                existingPortalHolder = null;
                            }

                            // Cell not previously rendered, create a portal for it
                            if (!existingPortalHolder) {
                                // Create a portal holder, an element that we will render the portal to.
                                // Separate since we are going to hide it or remove it when no longer visible
                                cellElement.innerHTML = `<div class="b-react-portal-holder" data-portal="${portalId}"></div>`;

                                // Get the portal holder created above
                                const portalHolder =
                                    cellElement.firstElementChild;

                                // Create a portal targeting the holder (will belong to the existing React tree)
                                const portal = ReactDOM.createPortal(
                                    cellContent,
                                    portalHolder,
                                    portalId
                                );

                                // Link to element, for easy retrieval later
                                cellElementData.hasReactPortal = true;
                                cellElementData.portalHolder = portalHolder;
                                portalHolder.portal = portal;

                                // Store record generation, to be able to detect a change later
                                portalHolder.generation = record.generation;

                                // Put holder in a map, to be able to reuse/move it later
                                portalHolderMap.set(portalId, portalHolder);

                                // Store portal in state for React to not loose track of it
                                state.portals.add(portal);
                                this.setState({
                                    generation: state.generation++
                                });
                            }
                            // Cell that already has a portal, reuse it
                            else {
                                // Move it to the cell
                                cellElement.appendChild(existingPortalHolder);
                                // Show it
                                existingPortalHolder.style.display = '';
                                // Link it
                                cellElementData.portalHolder = existingPortalHolder;
                            }
                        }
                        shouldSetContent = false;
                    }

                    return shouldSetContent;
                }
            };

        this.portalHolderMap = new Map();

        // Relay properties with names matching this.featureRe to features
        this.features.forEach(featureName => {
            if (featureName in props) {
                config.features[featureName.replace(this.featureRe, '')] = props[featureName];
            }
        });

        // Handle config (relaying all props except those used for features to scheduler)
        Object.keys(props).forEach(propName => {
            if (!propName.match(this.featureRe) && undefined !== props[propName]) {
                if (propName === 'features') {
                    console.warn('Passing "features" object as prop is not supported. Set features one-by-one with "Feature" suffix, for example "timeRangesFeature".');
                }
                else {
                    config[propName] = props[propName];
                }
            }
        });

        // console.log(config);

        // Create the actual scheduler, used as engine for the wrapper
        const engine = this.schedulerInstance = props.schedulerClass ? new props.schedulerClass(config) : new Scheduler(config);

        // Release any contained React components when a row is removed
        engine.rowManager.on({
            removeRow : ({ row }) => row.cells.forEach(cell => this.releaseReactCell(cell))
        });

        // Make stores easier to access
        this.resourceStore = engine.resourceStore;
        this.eventStore = engine.eventStore;

        // Map all features from schedulerInstance to scheduler to simplify calls
        Object.keys(engine.features).forEach(key => {
            const featureName = key + 'Feature';
            if (!this[featureName]) {
                this[featureName] = engine.features[key];
            }
        });

        // Shortcut to set syncDataOnLoad on the stores
        if (props.syncDataOnLoad) {
            engine.resourceStore.syncDataOnLoad = true;
            engine.eventStore.syncDataOnLoad = true;
        }

        if (config.events) {
            this.lastEvents = config.events.slice();
        }

        if (config.resources) {
            this.lastResources = config.resources.slice();
        }
    }

    // React component removed, destroy engine
    componentWillUnmount() {
        this.schedulerInstance.destroy();
    }

    // Component about to be updated, from changing a prop using state. React to it depending on what changed and
    // prevent react from re-rendering our component.
    shouldComponentUpdate(nextProps, nextState) {
        const
            { props, schedulerInstance : engine } = this,
            // These props are ignored or has special handling below
            excludeProps = [
                'adapter',
                'children',
                'columns',
                'events',
                'eventsVersion',
                'features', // #445 React: Scheduler crashes when features object passed as prop
                'listeners', // #9114 prevents the crash when listeners are changed at runtime
                'ref',
                'resources',
                'resourcesVersion',
                'timeRanges',
                ...this.features
            ];

        // Reflect configuration changes. Since most scheduler configs are reactive the scheduler will update automatically
        Object.keys(props).forEach(propName => {
            // Only apply if prop has changed
            if (!excludeProps.includes(propName) && !ObjectHelper.isEqual(props[propName], nextProps[propName])) {
                engine[propName] = nextProps[propName];
            }
        });

        if (
            // resourceVersion used to flag that data has changed
            nextProps.resourcesVersion !== props.resourcesVersion ||
            // If not use do deep equality check against previous dataset
            // TODO: Might be costly for large datasets
            (!('resourcesVersion' in nextProps) && !('resourcesVersion' in props) && !ObjectHelper.isDeeplyEqual(this.lastResources, nextProps.resources))) {
            engine.resources = nextProps.resources;
            this.lastResources = nextProps.resources && nextProps.resources.slice();
        }

        if (
            // eventVersion used to flag that data has changed
            nextProps.eventsVersion !== props.eventsVersion ||
            // If not use do deep equality check against previous dataset
            // TODO: Might be costly for large datasets
            (!('eventsVersion' in nextProps) && !('eventsVersion' in props) && !ObjectHelper.isDeeplyEqual(this.lastEvents, nextProps.events))) {
            engine.events = nextProps.events;
            this.lastEvents = nextProps.events && nextProps.events.slice();
        }

        // Reflect feature config changes
        this.features.forEach(featureName => {
            const currentProp = props[featureName],
                nextProp = nextProps[featureName];

            if (featureName in props && !ObjectHelper.isDeeplyEqual(currentProp, nextProp)) {
                engine.features[featureName.replace(this.featureRe, '')].setConfig(nextProp);
            }
        });

        // Reflect JSX cell changes
        return (nextState.generation !== this.state.generation);
    }

    render() {
        return <div className={'b-react-scheduler-container'} ref={el => this.el = el}>{this.state.portals}</div>;
    }

}

export default BryntumScheduler;

