import React, { Component, PropTypes } from 'react';
import { Route, Link } from 'react-router';
import { List, Map, fromJS } from 'immutable';
import AutoRequest from 'bd-stampy/components/AutoRequest';

import Loader from 'toyota-styles/lib/components/Loader';
import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
import Button from 'toyota-styles/lib/components/Button';

//
// Function to create a routing pattern for use with this editor
//

export function createEditorRoutes(params) {
    if(!params || !params.path || !params.component) {
        console.warn("Create editor routes must be passed an object with 'path' and 'component' keys, where the path is a string of the route path, and the component is the editor component to be used in the routes.");
        return null;
    }
    return (
        <Route path={params.path}>
            <Route path="new" component={params.component}/>
            <Route path=":id/edit" component={params.component}/>
            <Route path=":id/copy" component={params.component}/>
        </Route>
    );
};

//
// EntityEditor class
//

class EntityEditor extends Component {

    //
    // lifecycle methods
    //

    initialState() {
        return {
            prompt: false,
            promptMessage: false,
            newId: false
        };
    }

    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.prompts = {
            created:        this.renderCreated.bind(this),
            updated:        this.renderUpdated.bind(this),
            copied:         this.renderCopied.bind(this),
            deleted:        this.renderDeleted.bind(this),
            writeError:     this.renderWriteError.bind(this),
            confirmClose:   this.renderConfirmClose.bind(this)
        };
    }

    componentWillReceiveProps(newProps) {
        // reset state if we're moving to a new entity
        if(this.props.id != newProps.id) {
            this.setState(this.initialState());
        }
    }


    //
    // helpers
    //

    willCreateNew(props = this.props) {
        return !props.id;
    }

    willCopy(props = this.props) {
        const split = fromJS(props.routes)
            .last()
            .get('path')
            .split('/');

        return fromJS(split).last() == "copy";
    }

    createsOnSave(props = this.props) {
        return this.willCreateNew(props) || this.willCopy(props);
    }

    //
    // naming / text labels
    //

    entityName(modifications) {
        var name = this.props.entityName;
        if(!modifications) {
            return name;
        }
        if(modifications.includes('plural')) {
            name = this.props.entityNamePlural || this.props.entityName+"s";
        }
        return this.genericNameTransform(name, modifications);
    }

    actionName(modifications) {
        var name = "edit";
        if(this.willCreateNew()) {
            name = "new";
        } else if(this.willCopy()) {
            name = "copy";
        }
        return this.genericNameTransform(name, modifications);
    }

    genericNameTransform(name, modifications) {
        if(modifications.includes('first')) {
            name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        return name;
    }

    //
    // UI states
    //

    showPrompt(type, additionalState = {}) {
        if(this.prompts[type]) {
            const {
                promptMessage,
                newId
            } = additionalState;

            this.setState({
                prompt: type,
                promptMessage,
                newId
            });
        } else {
            console.warn("No prompt called "+type);
        }
    }

    hidePrompt() {
        this.setState({
            prompt: false,
            promptMessage: false
        });
    }

    //
    // navigation
    //

    getEditLink() {
        // only used to allow people to navigate from a newly created item to its edit page
        if(!this.state.newId) {
            return null;
        }
        const link = "/"+fromJS(this.props.routes)
            .filter(ii => ii.has('path') && ii.get('path') != "/")
            .map(ii => ii.get('path'))
            .join("/");

        return link.replace(/(\/new|\/:id\/(edit|copy))/i, "/"+this.state.newId+"/edit");
    }

    //
    // handlers
    //

    handleSubmitForm(values, callback) {
        if(this.createsOnSave()) {
            this.props.onCreate(values,
                (newId) => {
                    if(this.props.writeError) {
                        this.showPrompt('writeError', {promptMessage:'There was a problem while saving, please try again.'});
                    } else if(this.willCopy()) {
                        this.showPrompt('copied', {newId});
                    } else {
                        this.showPrompt('created', {newId});
                    }
                    if(callback) {
                        callback();
                    }
                }
            );
        } else {
            this.props.onUpdate(this.props.id, values,
                () => {
                    if(this.props.writeError) {
                        this.showPrompt('writeError', {promptMessage:'There was a problem while saving, please try again.'});
                    } else {
                        this.showPrompt('updated');
                    }
                    if(callback) {
                        callback();
                    }
                }
            );
        }
    }

    handleDelete() {
        this.props.onDelete(this.props.id, () => {
            if(this.props.writeError) {
                this.showPrompt('writeError', {promptMessage:'There was a problem while deleting, please try again.'});
            } else {
                this.showPrompt('deleted');
            }
            if(callback) {
                callback();
            }
        });
    }

    handleClose(unsavedChanges = false) {
        if(unsavedChanges) {
            // todo - replace with modal
            this.showPrompt('confirmClose');
        } else {
            this.props.onClose();
        }
    }

    handleReset(callback) {
        // todo - replace with modal and only call callback if you're sure you want to reset
        callback();
    }

    //
    // render
    //

    render() {
        const {
            // react props
            children,
            // custom props
            reading,
            creating,
            updating,
            deleting,
            readError,
            writeError,
            onDelete
        } = this.props;

        if(reading) {
            return <Loader />;
        }

        if(readError) {
            return <ErrorMessage message={readError.message} />;
        }

        // inferred data transaction states
        const saving = creating || updating;
        const fetching = reading || creating || updating || deleting;

        const propsToAddToChildren = {

            // callbacks
            onSubmitForm: this.handleSubmitForm.bind(this),
            onClose: this.handleClose.bind(this),
            onDelete: this.handleDelete.bind(this),
            onReset: this.handleReset.bind(this),

            // data transaction states
            reading,
            creating,
            updating,
            deleting,
            saving,
            fetching,

            // abilities
            canSave: !fetching,
            canDelete: typeof onDelete == "function" && !fetching && !this.willCreateNew(),
            willCreateNew: this.willCreateNew(),
            willCopy: this.willCopy()
        };

        const childrenWithProps = React.Children.map(children, (child) => React.cloneElement(child, propsToAddToChildren));

        // set style of editor div to hide so children don't lose state while a prompt is open
        const style = this.state.prompt ? {display: 'none'} : {};
        return (
            <div>
                <div>
                    {this.state.prompt ? this.prompts[this.state.prompt]() : null}
                </div>
                <div style={style}>
                    {this.renderHeading()}
                    <div>{this.state.prompt ? this.prompts[this.state.prompt]() : ''}</div>
                    {childrenWithProps}
                </div>
            </div>
        );
    }

    renderHeading() {
        return this.props.showHeading ? <h1 className="hug-top">{this.actionName(['first'])} {this.entityName()}</h1> : null;
    }

    renderWriteError() {
        const promptMessage = this.state.promptMessage ? <p>{this.state.promptMessage}</p> : null;
        return (
            <div>
                <h2 className="hug-top">Error</h2>
                {promptMessage}
                <p>
                    <Button onClick={this.hidePrompt.bind(this)} modifier="grey">Close</Button>
                </p>
            </div>
        );
    }

    renderCreated() {
        const editLink = this.getEditLink();
        return (
            <div>
                <h2 className="hug-top">{this.entityName(['first'])} created</h2>
                <p>
                    <Button onClick={this.handleClose.bind(this, false)}>Done</Button>&nbsp;
                    {editLink &&
                        <Link to={editLink} className="Button Button-grey">Edit {this.entityName()}</Link>
                    }
                </p>
            </div>
        );
    }

    renderUpdated() {
        return (
            <div>
                <h2 className="hug-top">{this.entityName(['first'])} saved</h2>
                <p>
                    <Button onClick={this.handleClose.bind(this, false)}>Done</Button>&nbsp;
                    <Button onClick={this.hidePrompt.bind(this)} modifier="grey">Keep editing</Button>
                </p>
            </div>
        );
    }

    renderCopied() {
        const editLink = this.getEditLink();
        return (
            <div>
                <h2 className="hug-top">{this.entityName(['first'])} copied</h2>
                <p>
                    <Button onClick={this.handleClose.bind(this, false)}>Done</Button>&nbsp;
                    {editLink &&
                        <Link to={editLink} className="Button Button-grey">Edit {this.entityName()}</Link>
                    }
                </p>
            </div>
        );
    }

    renderDeleted() {
        return (
            <div>
                <h2 className="hug-top">{this.entityName(['first'])} deleted</h2>
                <p>
                    <Button onClick={this.handleClose.bind(this, false)}>Done</Button>
                </p>
            </div>
        );
    }

    renderConfirmClose() {
        return (
            <div>
                <h2 className="hug-top">Unsaved changes</h2>
                <p>You may have unsaved changes, are you sure you want to leave this page?</p>
                <p>
                    <Button onClick={this.handleClose.bind(this, false)}>Leave page</Button>&nbsp;
                    <Button onClick={this.hidePrompt.bind(this)} modifier="grey">Cancel</Button>
                </p>
            </div>
        );
    }
}

EntityEditor.propTypes = {
    // id
    id: PropTypes.any,
    // naming
    entityName: PropTypes.string,
    entityNamePlural: PropTypes.string,
    // data transaction states
    reading: PropTypes.bool,
    creating: PropTypes.bool,
    updating: PropTypes.bool,
    deleting: PropTypes.bool,
    // errors
    readError: PropTypes.any,
    writeError: PropTypes.any,
    // callbacks
    onRead: PropTypes.func,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    // routes
    routes: PropTypes.array.isRequired,
    // options
    showHeading: PropTypes.bool
};

EntityEditor.defaultProps = {
    showHeading: true
};

const autoRequest = AutoRequest(['params.id'], (props) => {
    if(props.id && props.onRead) {
        props.onRead(props.id);
    }
});

export default autoRequest(EntityEditor)
