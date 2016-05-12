import React from 'react';
import {Link} from 'react-router'
import Widget from 'trc/components/Widget';
import Icon from 'trc/components/Icon';
import Col from 'trc/components/Col';

var HomeCourseWidget = React.createClass({
    displayName: 'HomeCourseWidget',
    render: function () {
        var { to, href} = this.props
        return (
            <Col width={3}>
                <Widget className="flush relative l-height--homeWidget ">
                    {this.renderWidgetLink(to,href)}
                </Widget>
            </Col>
        );
    },
    renderWidgetLink(to,href){
        if(to){
            return <Link to={to}>{this.renderWidgetContent()}</Link>
        } else if(href) {
            return <a href={href}>{this.renderWidgetContent()}</a>
        } else {
            return this.renderWidgetContent()
        }
    },
    renderWidgetContent(){
        var {icon, image, department, title } = this.props;
        return <div>
            {this.renderIcon(icon)}
            {this.renderImage(image)}
            <div className={`Bar Bar-${department} Bar-widget absolute w100`}>{title}</div>
        </div>
    },
    renderIcon(icon){
        if(icon){
            return <div className="t-center absolute row4 w100 l-height--homeWidget"><Icon size="large" hexCode={`${icon}`} /></div>;
        }
    },
    renderImage(image){
        if(image){
            return <img className="w100 " src={`//static.toyotainstituteaustralia.com.au/img/content/widget/widget4x-${image}`} height="200" />;
        }
    }
});

module.exports = HomeCourseWidget;
