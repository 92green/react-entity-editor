/* @flow */
/* eslint-disable no-unused-vars */

import React from 'react';
import {fromJS, Map, List} from 'immutable';

import EntityEditorConfig from './EntityEditorConfig';
import Modal from '../modal/Modal';
import ModalContent from '../modal/ModalContent';

const NO_HISTORY_ERROR_MESSAGE: string = 'Entity Editor: history prop must be passed to editor when using ReactRouter4Config';
const NO_LOCATION_ERROR_MESSAGE: string = 'Entity Editor: location must be specified in actionProps when using ReactRouter4Config';

const go: Function = ({props}: Object) => ({continueRouteChange, location}: Object): Promiseable => {
    if(continueRouteChange) {
        continueRouteChange();
        return;
    }
    const {history} = props;
    if(!history) {
        throw new Error(NO_HISTORY_ERROR_MESSAGE);
    }
    if(!location) {
        throw new Error(NO_LOCATION_ERROR_MESSAGE);
    }
    history.push(location);
};

function protectRouteChange(entityEditorInstance: Object, config: EntityEditorConfig) {
    const ee: Object = entityEditorInstance;
    const {history} = ee.nextProps;
    if(!history) {
        throw new Error(NO_HISTORY_ERROR_MESSAGE);
    }

    ee.unblockRouteChange && ee.unblockRouteChange();

    // create mutable actionProps container so we can pass it into a workflow
    // before we actually have its contents
    var actionProps = {};

    // when react-router is about to change routes, this function will be called
    // so we reject react-router's automatic route transition and instead
    // provide an identical one as an actionProp
    // action at the end of the "go" action / workflow
    ee.unblockRouteChange = history.block((nextLocation: Object, action: string): boolean => {

        // if current task is blocking, that means we're in the middle of an operation
        // and something has tried to change routes
        // we assume this route change was issued by the operation itself
        // and therefore do not block it
        if(ee.isCurrentTaskBlocking(ee.nextProps)) {
            return true;
        }

        // pass nextLocation to continueRouteChange, which returns a thunk
        const continueRouteChange = actionProps.continueRouteChange(nextLocation, action);
        // start the "go" action
        ee.workflowStart("go", config.getIn(["actions", "go"]), {continueRouteChange});
        return false;
    });

    actionProps.continueRouteChange = (nextLocation: Object, action: string) => () => {
        ee.unblockRouteChange();
        switch(action) {
            case "PUSH":
                history.push(nextLocation);
                break;

            case "REPLACE":
            case "POP":
                history.replace(nextLocation);
                break;
        }
        protectRouteChange(entityEditorInstance, config);
    };
}

function unprotectRouteChange(entityEditorInstance: Object) {
    const ee: Object = entityEditorInstance;
    ee.unblockRouteChange && ee.unblockRouteChange();
}

const ReactRouter4Config: EntityEditorConfig = EntityEditorConfig({
    operations: {
        go
    },
    lifecycleMethods: {
        componentWillMount: {
            reactRouter4: protectRouteChange
        },
        componentWillUnmount: {
            reactRouter4: unprotectRouteChange
        }
    }
});

export default ReactRouter4Config;
