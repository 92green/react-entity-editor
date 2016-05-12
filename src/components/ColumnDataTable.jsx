var React = require('react');
var _ = require('lodash');

var ColumnDataTable = React.createClass({
    displayName: 'ColumnDataTable',
    propTypes: {
        data: React.PropTypes.array,
        headers: React.PropTypes.array
    },
    render: function () {
        return (
            <table className="ColumnDataTable">
                <tbody>
                    <tr>
                        <td className="ColumnDataTable_header">
                            <ul>
                                {this.renderListItems(this.props.headers)}
                            </ul>
                        </td>
                        {this.renderRows(this.props.data)}
                    </tr>
                </tbody>
            </table>
        );
    },
    renderListItems: function (items) {
        return _.map(items, function (item, key) {
            return <li key={key}>{item}</li>;
        });
    },
    renderRows: function (data) {
        return _.map(data, function (dd, key) {
            return <td key={key}>
                <ul>{this.renderListItems(dd.series)}</ul>
            </td>;
        }, this);
    }
});

module.exports = ColumnDataTable;
