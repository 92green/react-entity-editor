import React from 'react';
const repo = `https://github.com/dxinteractive/react-entity-editor`;

function Source(props) {
    const {
        exampleFile,
        exampleDir,
        children
    } = props;

    var href = "#";
    if(exampleDir) {
        href = `${repo}/tree/master/docs/src/${props.exampleDir}`;
    }
    return <a href={href}>{children}</a>;
}
export default Source;
