import React from 'react';
import {connect} from 'react-redux';
import {EntityEditorList} from 'react-entity-editor';

import SlothsEntityEditorConfig from './SlothsEntityEditorConfig';

function SlothsList(props) {
    const {
        sloths_list,
        entityEditor,
        dispatch
    } = props;

    return <div>
        <button className="Button" onClick={entityEditor.actions.goNew}>New sloth</button>
        <table className="Table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Speed</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sloths_list.map((sloth, key) => {
                    const {id} = sloth;
                    return <tr key={key}>
                        <td>{sloth.name}</td>
                        <td>{sloth.speed}</td>
                        <td>
                            <button className="Button Button-small" onClick={entityEditor.actions.goEdit.bind(this, {id})}>edit</button>
                            <button className="Button Button-small" onClick={entityEditor.actions.delete.bind(this, {id, dispatch})}>delete</button>
                        </td>
                    </tr>;
                })}
            </tbody>
        </table>
    </div>
}

const withEntityEditor = EntityEditorList(SlothsEntityEditorConfig);
const withRedux = connect();
export default withEntityEditor(withRedux(SlothsList));
