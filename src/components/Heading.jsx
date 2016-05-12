import classnames from 'classnames';
import Color from 'trc/components/Color';
import {TOYOTA} from 'trc/constants/Color';

export default function Heading(props) {
    return <props.level>
        <span>{props.title || props.children}</span>
        {props.subtitle ? <span className="t-muted"> {props.subtitle}</span> : null}
    </props.level>
}

Heading.defaultProps = {
    level: 'h1'
}