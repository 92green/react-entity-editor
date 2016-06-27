import React from 'react';
import Grid from 'trc-client-core/src/components/Grid';
import Col from 'trc-client-core/src/components/Col';
import Auth from 'trc-client-core/src/components/Auth';
import {Link} from 'react-router';

var Footer = React.createClass({
    displayName: 'Footer',
    render() {
        return (
            <div>
                <div className="l-content l-content-alt t-muted hide-phone" role="navigation">
                    <Grid>
                        <Col>
                            <div className="delta hug t-uppercase">
                                <Auth site="TOYOTA">TIA</Auth>
                                <Auth site="LEXUS">Lexus Academy</Auth>
                            </div>
                            <ul>
                                <li><a href="/#/about">
                                    <Auth site="TOYOTA">About TIA</Auth>
                                    <Auth site="LEXUS">About Lexus Academy</Auth>
                                </a></li>

                                <li><a href="/#/media/news">News</a></li>
                                <li><a href="/#/vision-and-mission">Vision and Mission</a></li>

                            </ul>
                        </Col>
                        <Col>
                            <div className="delta hug t-uppercase">Training</div>
                            <ul>
                                <li><a href="/#/course-fees">Course Fees</a></li>
                                <li><a href="/#/our-trainers">Our Trainers</a></li>
                            </ul>
                        </Col>
                        <Col>
                            <div className="delta hug t-uppercase">Resources</div>
                            <ul>
                                <li><a href="/#/course/?type=E_LEARNING&stream=ALL">Elearning</a></li>
                                <li><Link to="/survey-incentive-terms-and-conditions">Survey Incentive Terms And Conditions</Link></li>
                            </ul>
                        </Col>
                        <Col>
                            <div className="delta hug t-uppercase">Contact</div>
                            <ul>
                                <li><a href="/#/ask">Contact Us</a></li>
                                <li><a href="/help/faq">FAQ</a></li>
                                <li><a href="/help">Help</a></li>
                            </ul>
                        </Col>
                    </Grid>
                    <small className="l-block t-muted row hug-bottom"><em>Powered by Blue Flag</em></small>
                </div>
                <Auth site="TOYOTA">
                    <div className="l-content">
                        <img className="Jumper" src="http://static.toyotainstituteaustralia.com.au/img/site/jumper.png" alt="Jumper" width="85" height="80"/>
                    </div>
                </Auth>
            </div>
        );
    }
});

module.exports = Footer;
