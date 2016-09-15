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

class BasicExample extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			users: users,
			editMode: false,
			editUserId: undefined
		};

		this.handleRead = this.handleRead.bind(this);
		this.handleCreate = this.handleCreate.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleClose = this.handleClose.bind(this);
        this.handleClickAddUser = this.handleClickAddUser.bind(this);
	}

    //
    // data handling
    //

	handleRead(id) {
		const currentUserData = {
            ...this.state.users[id],
            id
        };

        this.setState({
            currentUserData
        });

        return currentUserData;
	}

	handleCreate(dataObject) {
        // arbitrary method to get new id
        const newId = new Date().getTime();
        users[newId] = dataObject;
        return { dataObject, newId }; // tell entity editor what the new id is
	}

	handleUpdate(id, dataObject) {
        var users = this.state.users;
        users[id] = dataObject;
		this.setState({
            users
        });
	}

	handleDelete(id) {
        delete users[id];
	}

    //
    // UI
    //

	handleClose() {
		this.setState({
			editMode: false,
			editUserId: undefined
		});
	}

	handleClickUser(id) {
		this.setState({
			editMode: true,
			editUserId: id
		});
	}

    handleClickAddUser() {
        this.setState({
            editMode: true,
            editUserId: null, // no id means this will create a new user on save
            currentUserData: null
        });
    }

    //
    // render
    //

    render() {

    	var userList = [];
    	for(var id in this.state.users) {
    		let user = this.state.users[id];
            userList.push(<tr key={id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td><span className="Button Button-small" onClick={this.handleClickUser.bind(this, id)}>Edit</span></td>
            </tr>);
        }

        return <div>
            <h1>react-entity-editor basic example</h1>

            {!this.state.editMode &&
            	<div>
            	    <table>
                        <tbody>
                        {userList}
                        </tbody>
                    </table>
                    <span className="Button Button-small" onClick={this.handleClickAddUser}>Add new user</span>
            	</div>
            }

            {this.state.editMode &&
            	<div>
                    <BasicEntityEditorForm
                        id={this.state.editUserId}
                        initialValues={this.state.currentUserData || {}}
                        onRead={this.handleRead}
                        onCreate={this.handleCreate}
                        onUpdate={this.handleUpdate}
                        onDelete={this.handleDelete}
                        onClose={this.handleClose}
                        entityName="user"
                    />
                </div>
            }

        </div>;
    }
}

export default BasicExample;
