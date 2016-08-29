import React from 'react';
import BasicEntityEditorForm from './BasicEntityEditorForm';

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

class Basic extends React.Component {
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
	}

	handleRead(id) {
		return this.state.users[id];
	}

	handleCreate(dataObject) {
		console.log("create");
	}

	handleUpdate(id, dataObject) {
		console.log("update");
	}

	handleDelete(id) {
		console.log("delete");
	}

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

    render() {

    	var userList = [];
    	for(var id in this.state.users) {
    		var user = this.state.users[id];
            userList.push(<li key={id} onClick={this.handleClickUser.bind(this, id)}>{`${user.firstName} ${user.lastName}`}</li>);
        }

        return <div>
            <h1>react-entity-editor basic example</h1>

            {!this.state.editMode &&
            	<div>
            	    <p>Click on a user to edit them</p>
            	    <ul>{userList}</ul>
            	</div>
            }

            {this.state.editMode &&
            	<div>
                    <span onClick={this.handleClose}>Close</span>
                    <BasicEntityEditorForm
                        id={this.state.editUserId}
                        onRead={this.handleRead}
                        onCreate={this.handleCreate}
                        onUpdate={this.handleUpdate}
                        onDelete={this.handleDelete}
                        onClose={this.handleClose} />
                </div>
            }

        </div>;
    }
}

export default Basic;
