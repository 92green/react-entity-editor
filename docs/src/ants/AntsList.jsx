import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import ButtonDelete from '../buttons/ButtonDelete';
import ButtonGoEdit from '../buttons/ButtonGoEdit';
import ButtonGoNew from '../buttons/ButtonGoNew';

class AntsList extends Component {
    render() {
        const {ants, entityEditor} = this.props;
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
