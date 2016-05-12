
import React from 'react';
import ClassMixin from 'bd-stampy/mixins/ClassMixin.jsx';
import Icons from 'trc-client-core/src/constants/Icon';

function getUnicodeCharacter(cp) {
    if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
        return String.fromCharCode(cp);
    }
    else if (cp >= 0x10000 && cp <= 0x10FFFF) {

        // we substract 0x10000 from cp to get a 20-bits number
        // in the range 0..0xFFFF
        cp -= 0x10000;

        // we add 0xD800 to the number formed by the first 10 bits
        // to give the first byte
        var first = ((0xffc00 & cp) >> 10) + 0xD800;

        // we add 0xDC00 to the number formed by the low 10 bits
        // to give the second byte
        var second = (0x3ff & cp) + 0xDC00;

        return String.fromCharCode(first) + String.fromCharCode(second);
    }
}

/**
 * Icons Either pass in a hexcode or an array of svg paths.
 */
var Icon = React.createClass({
    displayName: 'Icon',
    mixins:[
        ClassMixin
    ],
    propTypes: {
        name: React.PropTypes.string,
        block: React.PropTypes.bool,
        component: React.PropTypes.func,
        inline: React.PropTypes.bool,
        onClick: React.PropTypes.func,
        size: React.PropTypes.string,
        paths: React.PropTypes.array,
        hexCode: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            componentType: React.DOM.span,
            type: 'fontface',
            name: 'blank',
            paths: []
        };
    },
    getClasses() {
        var classes = this.createClassName('Icon');
        classes.modifier(this.props.size);

        if(this.props.name) {
            classes.modifier(this.props.name.toLowerCase());
        }

        return classes;
    },
    render() {
        if (this.props.type === 'svg') {
            return this.renderSvg();
        }

        return this.renderFontFace();
    },
    renderSvg() {
        var classes = this.getClasses();
        classes.modifier('svg');
        return (
            <svg {...this.props}
                className={classes.className}
                width="0"
                height="0">
                {this.props.paths.map((path, key) => <path key={key} d={path}></path>)}
            </svg>
        );
    },
    renderFontFace() {
        var {hexCode, name} = this.props;
        var componentType = this.props.componentType;
        var iconCode = 'E139';
        var iconType = (this.props.size === 'small') ? 1 : 0;
        var classes = this.getClasses();

        iconCode = hexCode || Icons[name.toLowerCase()][iconType];

        var hexIconCode = parseInt(iconCode, 16);

        return componentType({
            className: classes.className,
            onClick: this.props.onClick,
            onMouseDown: this.props.onMouseDown,
            'data-icon': (iconCode.toLowerCase() === hexIconCode.toString(16)) ? getUnicodeCharacter(hexIconCode) : iconCode,
            ariaHidden:true,
            style: this.props.style
        }, this.props.children);
    }
});

module.exports = Icon;
