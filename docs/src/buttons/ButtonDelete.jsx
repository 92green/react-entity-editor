import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class ButtonDelete extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // the delete action expects an id
        this.props.entityEditor.actions.delete({
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

ButtonDelete.propTypes = {
    id: PropTypes.any.isRequired,
    entityEditor: EntityEditorPropType.isRequired,
    className: PropTypes.string
};

export default ButtonDelete;
