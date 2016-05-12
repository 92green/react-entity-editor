import classnames from 'classnames';
import Color from 'trc-client-core/src/components/Color';
import {TOYOTA} from 'trc-client-core/src/constants/Color';

export default function HeroText(props) {
    var className = classnames('HeroText margin-left', props.className);
    var style = {};

    if (props.colorPercentage) {
        style.color = Color(TOYOTA.GREEN).mix(Color(TOYOTA.RED), props.colorPercentage / 100).hexString();
    }

    return <div className={className} style={style}>{props.children}</div>
}