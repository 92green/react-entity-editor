/* flow */

import keys from 'lodash/fp/keys';

export default (state: ?Object, onChange: ?Function): Object => ({
    get: (key: ?string): * => {
        if(!state) {
            return null;
        }

        let {
            workflow,
            name,
            meta
        } = state;

        let nextSteps = null;
        let task = null;

        if(workflow) {
            task = workflow.task;
            nextSteps = keys(workflow.next);
        }

        let output = {
            name,
            meta,
            nextSteps,
            task
        };

        return key ? output[key] : output;
    },
    start: (workflow: Object, name: string, initialMeta: *) => {
        onChange({
            workflow,
            name,
            meta: initialMeta
        });
    },
    next: (nextStep: string, metaUpdater: ?Function = ii => ii) => {
        const {workflow} = state || {};
        if(!workflow || !workflow.next || !workflow.next.hasOwnProperty(nextStep)) {
            onChange({});
            return;
        }

        onChange({
            ...state,
            workflow: workflow.next[nextStep],
            meta: metaUpdater(state.meta)
        });
    },
    end: () => {
        onChange({});
    }
});
