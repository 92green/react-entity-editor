import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';
import {EntityEditorPropType} from 'react-entity-editor';

class AntsList extends Component {
    handleDelete(id) {
        // the delete action expects an id
        this.props.entityEditor.actions.delete({id});
    }
    render() {
        const {ants, entityEditor} = this.props;
        const {item} = entityEditor.names;

        return <div>
            <Link
                children={`New ${item}`}
                to="/ants/item"
                className="Button"
            />
            <table className="Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Legs</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ants.map((ant) => {
                        const {id} = ant;
                        return <tr key={id}>
                            <td>{ant.name}</td>
                            <td>{ant.legs}</td>
                            <td>
                                <Link
                                    children="edit"
                                    to={`/ants/item/${id}`}
                                    className="Button Button-small"
                                />
                                <button
                                    children="delete"
                                    className="Button Button-small Button-secondary"
                                    onClick={() => this.handleDelete(id)}
                                    disabled={!entityEditor.actionable}
                                />
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>;
    }
}

AntsList.propTypes = {
    ants: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            legs: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired
};

export default AntsList;
