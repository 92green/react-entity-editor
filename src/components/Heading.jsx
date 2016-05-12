import classnames from 'classnames';
import Color from 'trc-client-core/src/components/Color';
import {TOYOTA} from 'trc-client-core/src/constants/Color';

export default function Heading(props) {
    return <props.level>
        <span>{props.title || props.children}</span>
        {props.subtitle ? <span className="t-muted"> {props.subtitle}</span> : null}
    </props.level>
}

Heading.defaultProps = {
    level: 'h1'
}