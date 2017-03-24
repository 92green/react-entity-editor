/* @flow */
/* eslint-disable no-unused-vars */

type Config = {
    actions: Object,
    operations: Object,
    prompts: {
        [key: string]: {
            confirm?: PromptConfig,
            success?: PromptConfig,
            error?: PromptConfig
        }
    },
    promptDefaults: PromptConfig
};

type PromptConfig = {
    message?: ReactClass<any>|string,
    yes?: string,
    no?: string,
    title?: string|Object,
    showWhen?: Function,
    asProps?: boolean
};

type ActionConfig = {
    actions: Object,
    operations: Object
};

type CallbackConfig = {
    operations: Object,
    setEditorState: Object
};

// Promiseable is a type that includes everything that Utils.returnPromise() can accept
type Promiseable = ?Promise<*>|Object|boolean;
