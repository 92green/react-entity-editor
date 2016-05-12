import Carousel from 'trc-client-core/src/components/Carousel';
import CarouselItem from 'trc-client-core/src/components/CarouselItem';
import Col from 'trc-client-core/src/components/Col';
import Grid from 'trc-client-core/src/components/Grid';
import React from 'react';
import UserStore from 'trc-client-core/src/user/UserStore';
import {FDLP_BANNER} from 'trc-client-core/src/media/CarouselContent';

var DepartmentHandler = React.createClass({
    displayName: 'DepartmentHandler',
    getDepartment() {
        return this.props.location.pathname.match(/\/([a-zA-z]*)\/?/)[1];
    },
    render(){
        var {sidebar, content} = this.props;

        var cloneWithProps = (element) => {
            return React.cloneElement(element, {
                department: this.getDepartment()
            })
        }

        return <div>
            {this.renderDefaultCarousel()}
            <Grid>
                <Col width={3}>
                    {cloneWithProps(sidebar)}
                </Col>
                <Col>{cloneWithProps(content)}</Col>
            </Grid>
        </div>
    },
    renderDefaultCarousel() {
        if(this.props.carousel) {
            return this.props.carousel;
        }
        return <Carousel modifier="hero">
            {this.renderCarouselItems()}
        </Carousel>
    },
    renderCarouselItems() {
        var department = this.getDepartment();
        switch(department) {
            case 'management':
                return FDLP_BANNER;
            case 'sales':
            case 'parts':
            case 'service':
                return <CarouselItem image={`banner/department_${department}@${UserStore.get('site')}.jpg`} center />;
            default:
                return <CarouselItem image="" center>No Image Provided </CarouselItem>
        }
    }
});

module.exports = DepartmentHandler;
