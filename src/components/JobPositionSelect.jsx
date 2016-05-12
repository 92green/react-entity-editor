import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';
import Select from 'trc-client-core/src/components/Select';

var JobPositionSelect = React.createClass({
    displayName: 'JobPositionSelect',
    mixins: [
        PureRenderMixin
    ],
    onChange(e, details) {
        if(this.props.onChange) {
            return this.props.onChange(e, {
                key: this.props.name,
                value: details.value
            });
        }        
    },
    render: function () {
        var options = _(this.props.jobPositions)
            .sortBy('jobPositionDesc')
            .map(job => {
                return {
                    value: job.jobPositionId,
                    label: job.jobPositionDesc
                };
            }).value();

        return <Select {...this.props} onChange={this.onChange} multi options={options}/>;
    }
});

module.exports = JobPositionSelect;