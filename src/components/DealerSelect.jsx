import React from 'react';
import Select from 'trc/components/Select';
import {connect} from 'react-redux';
import {fetchDealerCodes} from 'trc/participant/DealerActions';
import {ALL_REGIONS} from 'trc/constants/Region';

var DealerSelect = React.createClass({
    displayName: 'Dealer Select',
    getDefaultProps() {
        return {
            name: 'dealerCode',
            region: ALL_REGIONS,
            allDealers: false
        };
    },
    componentWillMount() {
        this.props.dispatch(fetchDealerCodes());
    },
    getOptions() {
        var {dealerCodes, region} = this.props;

        // Filter out other regions
        // if a prop is provided other that ALL_REGIONS
        if (region !== ALL_REGIONS) {
            dealerCodes = dealerCodes.filter(ii => ii.get('region') === region);    
        }

        if (this.props.allDealers) {
            return dealerCodes
                .sort()
                .unshift({value:"ALL_DEALERS", label:"All Dealers"});
        } else {
            return dealerCodes
                .sort();
        }

    },
    render: function() {
        

        return (
            <Select 
                queryString 
                name={this.props.name} 
                value={this.props.value} 
                options={this.getOptions().toJS()} 
                onChange={this.props.onChange}
            />
        );
    }

});

export default connect(state => ({
    dealerCodes: state.dealer.dealerCodes
}))(DealerSelect);