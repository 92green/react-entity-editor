import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';
import BatsItem from './BatsItem';

class BatsItemLoader extends Component {

    // componentWillMount() {
    //     // when this component mounts, if there is an id then request this bat by its id
    //     if(this.props.id) {
    //         this.get(this.props.id);
    //     }
    // }

    // componentWillReceiveProps(nextProps) {
    //     // when this component is about to receive props, if the id has changed then request this bat by its id
    //     if(nextProps.id && this.props.id !== nextProps.id) {
    //         this.get(nextProps.id);
    //     }
    // }

    // get(id) {
    //     // get the bat with the provided id
    //     const actionProps = {
    //         id
    //     };
    //     this.props.entityEditor.actions.get(actionProps);
    // }

    render() {
        const {id, bat, entityEditor} = this.props;
        const {status} = entityEditor;

        // if no id is given, this is a new item
        if(!id) {
            return <BatsItem
                entityEditor={entityEditor}
            />;
        }

        // if we don't have the item information yet...
        if(!bat) {
            // ...but if something is loading, show it
            if(status) {
                return <p><em>{status.title}</em></p>;
            }
            // or else, we have nothing to show at all
            return null;
        }

        return <BatsItem
            bat={bat}
            entityEditor={entityEditor}
        />;
    }
}

BatsItemLoader.propTypes = {
    id: PropTypes.string,
    bat: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        diet: PropTypes.string
    }),
    entityEditor: EntityEditorPropType.isRequired
};

export default BatsItemLoader;
