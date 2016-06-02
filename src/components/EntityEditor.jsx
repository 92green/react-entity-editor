import React, { Component, PropTypes } from 'react';
import { Route, Link } from 'react-router';
import { List, Map, fromJS } from 'immutable';

import Loader from 'toyota-styles/lib/components/Loader';
import ErrorMessage from 'toyota-styles/lib/components/ErrorMessage';
import AutoRequest from 'bd-stampy/components/AutoRequest';

//import ModalManager from 'trc-client-core/src/Modal/ModalManager';
//import ModalConfirm from 'trc-client-core/src/Modal/ModalConfirm';
//import LoadingActions from 'trc-client-core/src/global/LoadingActions';


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
            {params['new'] !== false && 
                <Route path="new" component={params.component}/>
            }
            {params['edit'] !== false && 
                <Route path=":id/edit" component={params.component} savesToExisting={true} />
            }
            {params['copy'] !== false && 
                <Route path=":id/copy" component={params.component} />
            }
            {params['delete'] !== false && 
                <Route path=":id/delete" component={params.component} />
            }
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
            created: false,
            copied: false,
            deleted: false,
            saveError: false
        };
    }

    constructor(props) {
        super(props);
        this.state = this.initialState();
    }

    ///componentWillMount() {
        //this.props.dispatch(jobPositionRequest());
        // this.props.dispatch(requestCourseList());
    ///}

    /*componentWillReceiveProps(newProps) {

        // reset state if a new contractor's info is to be shown in the form
        if(this.loadsFromExisting(newProps)) {
            this.setState(this.initialState());
        }
    }

    //
    // helpers
    //

    currentUser() {
        // gets the current contractor object (an immutable map), or null if none correspond to current id prop
        return this.props.user.get(this.props.params.id);
    }

    loadsFromExisting(props = this.props) {
        // returns true if the form loads from an existing record, false if the form starts blank
        return !!props.params.id; // true if a id exists
    }

    savesToExisting(props = this.props) {
        // returns true if the form saves to an existing record, false if the form is to create a new record on save
        return !!props.route.savesToExisting; // true if savesToExisting is true on the route
    }

    copiesExisting(props = this.props) {
        return this.loadsFromExisting() && !this.savesToExisting();
    }

    getInitialFormValues(currentUser) {
        if(!currentUser) {
            return {
                brand: "Toyota"
            };
        }

        var plan = currentUser.toJS();
        return plan;
    }

    //
    // event and click handlers
    //

    handleSubmit(values, dispatch) {
        this.saveUser(values);
    }

    handleResetClick(resetForm) {
        ModalManager.showModal(ModalConfirm, {
            title: 'Are you sure you want to reset?',
            message: 'Are you sure you want to reset? Any changes since your last save will be lost.',
            yes: 'Yes I\'m sure',
            onYes: resetForm,
            no: 'Cancel'
        });
    }

    handleCloseClick(ee, dirty = false) {
        ee.preventDefault();
        if(dirty) {
            ModalManager.showModal(ModalConfirm, {
                title: 'Unsaved changes',
                message: 'You may have unsaved changes, are you sure you want to leave this page?',
                yes: 'Leave page',
                onYes: this.closeContractor.bind(this),
                no: 'Cancel'
            });
        } else {
            this.closeContractor();
        }
    }

    handleDeleteClick(ee) {
        ee.preventDefault();
        ModalManager.showModal(ModalConfirm, {
            title: 'Delete contractor',
            message: 'Are you sure you want to delete this? This action cannot be undone',
            yes: 'Yes I\'m sure',
            onYes: this.deleteContractor.bind(this),
            no: 'Cancel'
        });
    }

    //
    // form actions
    //

    closeContractor() {
        this.props.history.push('/admin');
    }

    saveContractor(userObject) {

        console.log("saving "+userObject);

        const { id } = this.props.params;

        if(this.copiesExisting()) {
            this.props.dispatch(userRequestUpdate(id,userObject)).then(
                (data) => {
                    this.setState({
                        copied: data.payload.careerPlanId
                    });
                }
            );

        } else if(this.savesToExisting()) {

            LoadingActions.startLoading();
            this.props.dispatch(userRequestUpdate(id,userObject)).then(
                (data) => {
                    if(data.type == LEARNING_PLAN_UPDATE_ERROR) {
                        LoadingActions.flashMessage('failure long', 'An error occurred. Your work is not yet saved.\n'+data.payload.message, 5000);
                    } else {
                        LoadingActions.flashMessage('success', 'Save complete');
                    }
                }
            );

        } else {
            this.props.dispatch(userRequestCreate(userObject)).then(
                (data) => {
                    this.setState({
                        created: data.payload.careerPlanId
                    });
                }
            );
        }
    }

    deleteContractor() {

        console.log("Delete the man!");

        /*const { id } = this.props.params;
        LoadingActions.startLoading();
        this.props.dispatch(userRequestDelete(id)).then(
            (data) => {
                if(data.type == LEARNING_PLAN_DELETE_ERROR) {
                    LoadingActions.flashMessage('failure long', 'An error occurred. This contractor is not yet deleted.\n'+data.payload.message, 5000);
                } else {
                    LoadingActions.clearAll();
                    this.setState({
                        deleted: true
                    });
                }
            }
        );
    }*/

    handleSubmitForm(values) {
        console.log("Values", values);
    }

    //
    // render
    //

    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                onSubmitForm: this.handleSubmitForm.bind(this),
                form: "TEST",
                fields: [
                    'id',
                    'firstName',
                    'lastName',
                    'company'
                ],
                validate: (data) => ({})
            })
        );

        return <div>{childrenWithProps}</div>
    }

    renderEditor() {

        return '...';

        /*const { params: { id }, fetching, saving, deleting, error, handleSubmit, courses, jobPositions } = this.props;
        const { created, copied, deleted } = this.state;
        var showErrorPage = false;

        if(fetching) {
            return <Loader />;

        } else if(error) {
            // if there's an error we'll usually want to show an error page, except if the error happens on save
            showErrorPage = true;

        } else if (created) {
            return (
                <div>
                    <h2 className="hug-top">Contractor created</h2>
                    <p><Button onClick={this.handleCloseClick.bind(this)}>Back to list</Button>&nbsp;<Link to={`/admin/contractors/${created}/edit`} activeClassName="is-active" className="Button Button-edit">Edit contractor</Link></p>
                </div>
            );

        } else if (copied) {
            return (
                <div>
                    <h2 className="hug-top">Contractor copied</h2>
                    <p><Button onClick={this.handleCloseClick.bind(this)}>Back to list</Button>&nbsp;<Link to={`/admin/contractors/${copied}/edit`} activeClassName="is-active" className="Button Button-edit">Edit contractor</Link></p>
                </div>
            );

        } else if(deleted) {
            return (
                <div>
                    <h2 className="hug-top">Contractor deleted</h2>
                    <p><Button onClick={this.handleCloseClick.bind(this)}>Back to list</Button></p>
                </div>
            );
        }

        var title, id, contractor;

        // if trying to display a contractor, get contractor details

        if(id) {
            contractor = {} // todo this! this.currentContractor();

            if(!contractor) {
                // contractor at this URL doesn't exist
                return (
                    <div>
                        <h2 className="hug-top">No contractor found at this URL</h2>
                        <p><Button onClick={this.handleCloseClick.bind(this)}>Back to list</Button></p>
                    </div>
                );
            }

            var contractorJS = contractor; // =.toJS()
            title = contractorJS.displayName || "Unnamed contractor";
            id = contractorJS.careerPlanId;
            showErrorPage = false;

        } else {
            // no contractor id means this must be a new one
            title = "New contractor";
        }

        if(this.copiesExisting()) {
            title = "New copy of " + title;
        }

        if(showErrorPage) {
            return <ErrorMessage code={400} message={error.message} />;
        }

        var initialValues = this.getInitialFormValues(contractor);

        return (
            <div>
                <h1 className="hug-top">{title}</h1>

                <AdminContractorForm
                    onSubmit={this.handleSubmit}
                    savesToExisting={this.savesToExisting()}
                    copiesExisting={this.copiesExisting()}
                    isSaving={saving}
                    isDeleting={deleting}
                    onCloseClick={this.handleCloseClick.bind(this)}
                    onDeleteClick={this.handleDeleteClick.bind(this)}
                    onResetClick={this.handleResetClick.bind(this)}
                    onSubmitForm={this.handleSubmit.bind(this)}
                    initialValues={initialValues} />
            </div>
        );*/
    }
}

/*
EntityEditor.propTypes = {
    userEdit: PropTypes.object,
    fetching: PropTypes.bool,
    saving: PropTypes.bool,
    deleting: PropTypes.bool,
    error: PropTypes.object
};
*/

const autoRequest = AutoRequest(['params.id'], (props) => {
    // get contractor info
    console.log(props);

    /*if(props.params.id) {
        console.log(id);
        //props.dispatch(userRequestGet(props.params.id));
    }*/
});

export default autoRequest(EntityEditor);
