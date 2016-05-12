import React, { Component, PropTypes } from 'react';
import Icon from 'trc/components/Icon';
import Button from 'bd-stampy/components/Button';
import FormError from 'trc/forms/FormError';
import classnames from 'classnames';

//
// SortableFieldArray allows UIs with sortable form fields to be created for use with redux form: http://redux-form.com/5.0.1/#/examples/deep?_k=tf070c
//

class SortableFieldArray extends Component {

    render() {
        const { children, items, itemName, modifier, className } = this.props;

        var newChildren = React.Children.map(children, function(child, itemIndex) {
            return (
                <div key={itemIndex} className="SortableFieldArray_item">
                    <div className="SortableFieldArray_buttonSet">
                        <Button modifier="clear tight" disabled={itemIndex === 0} onClick={() => items.swapFields(itemIndex, itemIndex - 1)} title={`Move ${itemName} up`}>
                            <Icon hexCode="e113" modifier="small" />
                        </Button>
                        <Button modifier="clear tight" disabled={itemIndex === items.length - 1} onClick={() => items.swapFields(itemIndex, itemIndex + 1)} title={`Move ${itemName} down`}>
                        <Icon hexCode="e114" modifier="small" />
                        </Button>
                        <Button modifier="clear tight" onClick={() => items.removeField(itemIndex)} title={`Remove ${itemName}`}>
                            <Icon hexCode="e014" modifier="small" />
                        </Button>
                    </div>
                    <div className="SortableFieldArray_inputContainer">
                        {child}
                    </div>
                </div>
            );
        });

        var classNames = classnames(
            'SortableFieldArray', 
            modifier.split(' ').map(cc => `SortableFieldArray-${cc}`),
            className
        );

        return (
            <div className={classNames}>
                {newChildren}
                <Button modifier="edit" onClick={items.addField}>Add {itemName}</Button>
            </div>
        );
    }
}

SortableFieldArray.propTypes = {
    items: PropTypes.array,
    itemName: PropTypes.string,
    modifier: PropTypes.string
};

SortableFieldArray.defaultProps = {
    itemName: "item",
    modifier: ""
};

export default SortableFieldArray;