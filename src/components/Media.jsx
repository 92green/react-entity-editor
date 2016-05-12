
import React from 'react';
import classnames from 'classnames';

export default function Media(props) {
        var className = classnames(
            'Media',
            props.modifier && props.modifier.split(' ').map(mm => `Media-${mm}`),
            props.className
        );

        return <props.component {...props} className={className}>
            <div className="Media_image">{props.image}</div>
            <div className="Media_body">{props.children}</div>
        </props.component>;
};

Media.defaultProps = {
    component: 'div'
};

Media.propTypes = {
    component: React.PropTypes.string,
    modifier: React.PropTypes.string,
    image: React.PropTypes.component
};
