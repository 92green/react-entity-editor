'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _immutable = require('immutable');

var _Config = require('./Config');

var _Utils = require('./Utils');

function getPromptPromise(config, type, action, props) {
    var prompt = (0, _Config.promptWithDefaults)(config, type, action);
    if (!prompt) {
        return new Promise(function (resolve) {
            return resolve(props);
        });
    }
    return new Promise(function (resolve) {
        return resolve(props);
    });
}

function EntityEditorProps(config, options) {
    var _ref = options || {},
        preloadActionIds = _ref.preloadActionIds;

    var actions = (0, _immutable.fromJS)(config).get('actions', (0, _immutable.Map)()).map(function (action, actionName) {
        return function (props) {
            if (preloadActionIds) {
                props.id = preloadActionIds;
            }

            // create a promise to confirm the action, or a pre-resolved promise if no confirmation is set
            var promise = getPromptPromise(config, 'confirm', actionName, props);

            return promise.then(
            // confirmed
            function (props) {
                return (0, _Utils.returnPromise)(action(config)(props));
            },
            // cancelled
            function () {
                return console.log('cancelled');
            }).then(function (result) {
                return console.log('it was a success', result);
            }, function (result) {
                return console.log('it was a failure', result);
            });
        };
    }).toJS();

    return {
        actions: actions
    };
}

exports.default = EntityEditorProps;