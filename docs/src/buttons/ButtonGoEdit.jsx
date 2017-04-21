import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class ButtonGoEdit extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // the go action expects a view and an optional id
        this.props.entityEditor.actions.go({
            view: "item",
            id: this.props.id
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

ButtonGoEdit.propTypes = {
    id: PropTypes.any.isRequired,
    entityEditor: EntityEditorPropType.isRequired,
    className: PropTypes.string
};

export default ButtonGoEdit;
