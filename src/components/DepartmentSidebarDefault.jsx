import React from 'react';
import AskForm from 'trc-client-core/src/components/AskForm';
import Auth from 'trc-client-core/src/components/Auth';
import LearningPlanListCurrentParticipant from 'trc-client-core/src/learningPlan/LearningPlanListCurrentParticipant';
import IconList from 'trc-client-core/src/components/IconList';
import IconListItem from 'trc-client-core/src/components/IconListItem';
import SearchCourses from 'trc-client-core/src/components/SearchCourses';

var DepartmentSidebarDefault = React.createClass({
    displayName: 'DepartmentSidebarDefault',
    render() {
        var {department} = this.props;
        function renderSalesSociety() {
            if(department === 'sales') {
                return (
                    <Auth site="TOYOTA">
                        <a className="ArrowLink row" href="/#/sales-society-points"><div className="ArrowLink_inner">Sales Society Points</div> Here</a>
                    </Auth>
                );
            }
        }
        return (
            <div>
                <IconList>
                    <LearningPlanListCurrentParticipant />
                </IconList>
                {this.props.children}
                <AskForm/>
                <SearchCourses department={department}/>
                {renderSalesSociety()}
            </div>
        );
    }
});

export default DepartmentSidebarDefault;
