import React from 'react';
import Grid from 'trc-client-core/src/components/Grid';
import Col from 'trc-client-core/src/components/Col';

var DepartmentPage = React.createClass({
    displayName: 'DepartmentPage',
    propTypes: {
        carousel: React.PropTypes.element,
        sidebar: React.PropTypes.element
    },
    render() {
        return (
            <div>
                {this.props.carousel}
                <Grid>
                    <Col width={3}>{this.props.sidebar}</Col>
                    <Col>{this.props.children}</Col>
                </Grid>
            </div>
        );
    }
});

module.exports = DepartmentPage;