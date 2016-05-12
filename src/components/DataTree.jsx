import React from 'react';
import JSONTree from 'react-json-tree';


const GREY = '#999999';
const RED = '#eb2136';
const BLUE = '#4e9ae6';
const NESTING = 32;

const theme = {
    base00: GREY,
    base01: GREY,
    base02: GREY,
    base03: GREY,
    base04: GREY,
    base05: GREY,
    base06: GREY,
    base07: GREY,
    base08: GREY, // red
    base09: GREY, // orange
    base0A: GREY, // yellow
    base0B: BLUE, // strings
    base0C: GREY, // teal
    base0D: RED, // values
    base0E: GREY, // pruple
    base0F: GREY, // brown
    tree: {
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
        marginLeft: -32,
        fontSize: '13px',
        backgroundColor: 'transparent',
        fontFamily: 'Menlo, monospace'
    },
    value: {
        padding: 0,
        marginLeft: NESTING,
        wordWrap: 'nowrap',
        textIndent: 0
    },
    nestedNode: {
        position: 'relative',
        paddingTop: 0,
        paddingBottom: 0,
        marginLeft: NESTING
    },
    arrowContainer: ({style}, arrowStyle) => ({
        style: {
            display: 'inline-block',
            position: 'relative',
            top: -2,
            paddingRight: 5,
            cursor: 'pointer'
        }
    }),
}

export default function DataTree(props) {
    return <JSONTree theme={theme} hideRoot={true} {...props} />
}
