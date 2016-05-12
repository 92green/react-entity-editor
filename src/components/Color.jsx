//
// Wrapper functions for https://github.com/harthur/color
//

var _ = require('lodash');
var CLR = require('color');


var _colors = [
    {name: 'hero', hex:'#93619f'},
    {name: 'aqua', hex:'#76D4B7'},
    {name: 'red', hex:'#f76861'},
    {name: 'orange', hex:'#ffaa76'},
    {name: 'blue', hex:'#82b3e5'},
    {name: 'pink', hex:'#EB92C0'},
    {name: 'yellow', hex:'#FCCF5B'},
    {name: 'teal', hex:'#51CFAC'},
    {name: 'green', hex:'#93da8e'}
];

function _getColorByString(name) {
    var l = name.length + name.charCodeAt(0);
    var cl = _colors.length;

    while (l > cl) {
        l -= cl;
    }
    return _colors[l - 1].hex;
}

var Color = function(name) {
    var color = _.find(_colors, {'name' : name});

    if (color) {
        return CLR(color.hex);
    } else if(name.indexOf('#') !== -1) {
        return CLR(name);
    } else {
        return CLR(_getColorByString(name));
    }
};

module.exports = Color;
