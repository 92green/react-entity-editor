import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import ButtonDelete from '../buttons/ButtonDelete';
import ButtonGoEdit from '../buttons/ButtonGoEdit';
import ButtonGoNew from '../buttons/ButtonGoNew';

class CatsList extends Component {
    render() {
        const {cats, entityEditor} = this.props;
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
                    {cats.map((cat) => {
                        const {id} = cat;
                        return <tr key={id}>
                            <td>{cat.name}</td>
                            <td>{cat.toy}</td>
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

CatsList.propTypes = {
    cats: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            toy: PropTypes.string
        })
    ).isRequired,
    entityEditor: EntityEditorPropType.isRequired
};

export default CatsList;
