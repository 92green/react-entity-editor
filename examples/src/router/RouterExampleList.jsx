import React from 'react';
import {Link} from 'react-router';

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

class RouterExampleList extends React.Component {

    //
    // render
    //

    render() {

    	var userList = [];
    	for(var id in users) {
    		let user = users[id];
            userList.push(<tr key={id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td><Link className="Button Button-small" to={`router/${id}/edit`}>Edit</Link></td>
            </tr>);
        }

        return <div>
            <h1>react-entity-editor router example</h1>
            <div>
                <table>
                    <tbody>
                    {userList}
                    </tbody>
                </table>
                <Link className="Button Button-small" to="router/new">Add new user</Link>
            </div>
        </div>;
    }
}

export default RouterExampleList;
