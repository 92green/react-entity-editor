import React from 'react';
import classnames from 'classnames';
import {getCourseStatus} from 'trc/mixins/CourseMixin';
import PureRender from 'react-addons-pure-render-mixin';

var Tooltip = React.createClass({
    displayName: 'Tooltip',
    mixins: [PureRender],
    render() {
        var {offsetHeight, offsetWidth, offsetTop, offsetLeft} = this.props.offset;
        var width = this.props.width || 300

        var getStyle = () => {
            var flipOffset = (offsetLeft + width > this.props.rightLimit) ? width - offsetWidth : 0;
            return {
                top: offsetTop + offsetHeight,
                left: offsetLeft - flipOffset,
                width: width
            }
        }

        return (
            <div 
                className={classnames({
                    "Tooltip": true,
                    'Tooltip-hidden': this.props.hidden
                })} 
                style={getStyle()}
                children={this.props.children} />
        );
    }
});

module.exports = Tooltip;