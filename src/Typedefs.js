/* @flow */
/* eslint-disable no-unused-vars */

type Config = {
    actions: Object,
    callbacks: Object,
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
    message?: string,
    yes?: string,
    no?: string,
    title?: string|Object,
    showWhen?: Function,
    asProps?: boolean
};

type ActionConfig = {
    actions: Object,
    callbacks: Object
};

type CallbackConfig = {
    callbacks: Object,
    setEditorState: Object
};

type AfterActionProps = {
    result?: Object,
    actionProps?: Object,
    called?: string
};

// Promiseable is a type that includes everything that Utils.returnPromise() can accept
type Promiseable = ?Promise<*>|Object|boolean;
