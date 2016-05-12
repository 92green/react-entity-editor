import React from 'react';
import Loader from 'trc-client-core/src/components/Loader';
import DataTable from 'bd-stampy/components/DataTable';
import {History} from 'react-router';

var TablePaginated = React.createClass({
    displayName: 'TablePaginated',
    propTypes: {
        data: React.PropTypes.array.isRequired,
        schema: React.PropTypes.array.isRequired,
        filter: React.PropTypes.func,
        page: React.PropTypes.string,
        pageSize: React.PropTypes.number
    },
    mixins: [
        History
    ],
    contextTypes: {
        location: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            filter: function () {return true},
            pageSize: 50
        };
    },
    onPagingate(e, page) {
        var {location} = this.context;
        this.history.replaceState(null, location.pathname, {
            ...location.query,
            page: page
        });
    },
    render() {
        if(!this.props.data) {
            return <Loader></Loader>;
        }
        var currentPage = parseInt(this.context.location.query.page, 10) || 0;

        return <DataTable 
            schema={this.props.schema}
            search={this.props.search}
            data={this.props.data.filter(this.props.filter)} 
            pagination={true}
            paginationLength={this.props.pageSize}
            paginationPage={currentPage}
            onPagingate={this.onPagingate}
            modifier="data" 
        />;
    }
});

export default TablePaginated;