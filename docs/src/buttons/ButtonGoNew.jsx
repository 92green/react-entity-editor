import React, {Component, PropTypes} from 'react';
import {EntityEditorPropType} from 'react-entity-editor';

class ButtonGoNew extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // the go action expects a view and an optional id
        this.props.entityEditor.actions.go({
            view: "item",
            id: null // indicates to go to a new item
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

ButtonGoNew.propTypes = {
    entityEditor: EntityEditorPropType.isRequired,
    className: PropTypes.string
};

export default ButtonGoNew;
