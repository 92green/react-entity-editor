import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class ButtonSave extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // the save action expects a payload and an optional id
        // if id is falsey then the create operation will be called
        // or else the update operation will be called
        this.props.entityEditor.actions.save({
            id: this.props.id,
            payload: this.props.payload
        });
    }

    render() {
        const {entityEditor, className, children} = this.props;
        return <button
            className={`Button ${className}`}
            onClick={this.handleClick}
            disabled={!entityEditor.actionable}
            children={children}
        />
    }
}

ButtonSave.propTypes = {
    id: PropTypes.any,
    payload: PropTypes.object,
    entityEditor: EntityEditorPropType.isRequired,
    className: PropTypes.string
};

export default ButtonSave;
