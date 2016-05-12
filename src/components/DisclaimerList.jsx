import React from 'react';
import Media from 'trc-client-core/src/components/Media';

export default function renderDisclaimers(props) {
    if(props.data) {
        return <small>
            <ul>
                {props.data.map((ii, key) => <Media image={key} component="li">{ii}</Media>)}
            </ul>
        </small>
    }    
    return <small></small>;
}