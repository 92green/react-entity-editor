import React from 'react';
import {OrderedMap} from 'immutable';

var ObjectTable = React.createClass({
    displayName: 'ObjectTable',
    render() {
        return (
            <div className="Typography">
                <table>
                    <tbody>
                        {OrderedMap(this.props.data).map(this.renderRow).toList().toJS()}
                    </tbody>
                </table>
            </div>
        );
    },
    renderRow(value, key) {
        return <tr key={key}>
            <td>{key}</td>
            <td>{this.renderValue(value)}</td>
        </tr>;
    },
    renderValue(value) {
        if(value === null) {
            return 'null';
        }

        switch (typeof value) {
            case 'boolean':
                return value.toString();
            default:
                return value;
        }
    }
});

module.exports = ObjectTable;
