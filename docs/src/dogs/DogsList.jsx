import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import ButtonDelete from '../buttons/ButtonDelete';
import ButtonGoEdit from '../buttons/ButtonGoEdit';
import ButtonGoNew from '../buttons/ButtonGoNew';

class DogsList extends Component {
    render() {
        const {dogs, entityEditor} = this.props;
        const {item} = entityEditor.names;

        return <div>
            <ButtonGoNew
                children={`New ${item}`}
                entityEditor={entityEditor}
            />
            <table className="Table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Toy</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dogs.map((dog) => {
                        const {id} = dog;
                        return <tr key={id}>
                            <td>{dog.name}</td>
                            <td>{dog.toy}</td>
                            <td>
                                <ButtonGoEdit
                                    children="edit"
                                    className="Button-small"
                                    id={id}
                                    entityEditor={entityEditor}
                                />
                                <ButtonDelete
                                    children="delete"
                                    className="Button-small"
                                    id={id}
                                    entityEditor={entityEditor}
                                />
                            </td>
                        </tr>;
                    })}
                </tbody>
            </table>
        </div>;
    }
}

DogsList.propTypes = {
    dogs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired
};

export default DogsList;
