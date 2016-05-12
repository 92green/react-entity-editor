import React from 'react';
import Input from 'bd-stampy/components/InputElement';

var SearchCourses = React.createClass({
    displayName: 'SearchCourses',
    getInitialState() {
        return {
            search: ''  
        };
    },
    onChange(ee, details) {
        this.setState({
            search: details.value
        })
    },
    render() {
        return (
            <section className="row">
                <h3>Search Courses</h3>
                <div className="clearfix">
                    <Input name="search" onChange={this.onChange} className="Input Input-text Input-inline l-left w60"/>
                    <a className="Button l-left w40" href={`/#/course/?search=${this.state.search}`}>search</a>
                </div>
                <em>e.g. {this.props.department}, course code, course name </em>
            </section>
        );
    }
});

module.exports = SearchCourses;