import {STATIC_ASSETS} from 'trc-client-core/src/constants/url';
import AboutCopy from 'trc_copy/About.md';

import UserStore from 'trc-client-core/src/user/UserStore';
import Markdown from 'trc-client-core/src/components/Markdown';
import Site from 'trc-client-core/src/constants/Site';

import Auth from 'trc-client-core/src/components/Auth';
import Grid from 'trc-client-core/src/components/Grid';
import Col from 'trc-client-core/src/components/Col';


export default function About(props) {
    return <Grid>
        <Col>
            <Markdown html={AboutCopy} context={Site[UserStore.get('site')]}/>
        </Col>
        <Col>
            <Auth site="TOYOTA">
                <p><iframe src="http://player.vimeo.com/video/60509876?title=1" width="100%" height="249" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></p>
                <p><img src={`${STATIC_ASSETS}img/site/about/tia1.jpg`} height="249"/></p>
                <p><img src={`${STATIC_ASSETS}img/site/about/tia2.jpg`} height="249"/></p>
                <p><img src={`${STATIC_ASSETS}img/site/about/tia3.jpg`} height="249"/></p>
            </Auth>
            <Auth site="LEXUS">
                <p><img src={`${STATIC_ASSETS}img/content/help/help_lexus_1.jpg`} height="249"/></p>
                <p><img src={`${STATIC_ASSETS}img/content/help/help_lexus_2.jpg`} height="249"/></p>
                <p><img src={`${STATIC_ASSETS}img/content/help/help_lexus_3.jpg`} height="249"/></p>
                <p><img src={`${STATIC_ASSETS}img/content/help/help_lexus_4.jpg`} height="249"/></p>
            </Auth>
        </Col>
    </Grid>;
}