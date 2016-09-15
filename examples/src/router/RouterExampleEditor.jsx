import React from 'react';
import BasicEntityEditorForm from '../forms/BasicEntityEditorForm';

const users = {
    "1": {
    	firstName: "Bob",
    	lastName: "Floss"
    },
    "2": {
    	firstName: "Jeff",
    	lastName: "Chumps"
    },
    "3": {
    	firstName: "Tom",
    	lastName: "Flanks"
    }
};

class RouterExampleEditor extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleRead = this.handleRead.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

    //
    // data handling
    //

	handleRead(id) {
		/*const currentUserData = {
            ...this.state.users[id],
            id
        };

        this.setState({
            currentUserData
        });

        return currentUserData;*/
	}

	handleCreate(dataObject) {
        // arbitrary method to get new id
        /*/const newId = new Date().getTime();
        users[newId] = dataObject;
        return { dataObject, newId }; // tell entity editor what the new id is*/
	}

	handleUpdate(id, dataObject) {
        /*var users = this.state.users;
        users[id] = dataObject;
		this.setState({
            users
        });*/
	}

	handleDelete(id) {
        /*delete users[id];*/
	}

    //
    // render
    //

    render() {

        return <div>
            <h1>react-entity-editor router example</h1>

            <div>
                <BasicEntityEditorForm
                    {...this.props}
                    initialValues={/*this.state.currentUserData ||*/ {}}
                    onRead={this.handleRead}
                    onCreate={this.handleCreate}
                    onUpdate={this.handleUpdate}
                    onDelete={this.handleDelete}
                    entityName="user"
                />
            </div>

        </div>;
    }
}

export default RouterExampleEditor;
