var React = require('react');
var Immutable = require('immutable');
var hotkey = require('react-hotkey');
var key = require('bd-stampy/utils/Key');
var ReactSelect = require('react-select');

import {History} from 'react-router';
import RouterContainer from 'trc-client-core/src/global/RouterContainer';
import UserStore from 'trc-client-core/src/user/UserStore';
import Label from 'bd-stampy/components/Label';
import Input from 'bd-stampy/components/Input';


// Enable event listening, can be safely called multiple times
hotkey.activate();

var GoAnywhere = React.createClass({
    displayName: 'GoAnywhere',
    mixins: [
        hotkey.Mixin('onKey'),
        History
    ],
    getInitialState() {
        return {
            visible: false,
            stage: 1,
            url: '/',
            routes: Immutable.List(RouterContainer.get().routes)
        };
    },
    getTicketTable() {
        var router = RouterContainer.get();
        var currentRoutes = router.getCurrentRoutes();
        return '```\n' + JSON.stringify({
            user: UserStore.get('fullName'),
            participantId: UserStore.get('participantId'),
            authorities: UserStore.get('authorities'),
            dealerName: UserStore.get('dealerName'),
            learningPlans: UserStore.get('learningPlans').map(ll => ll.get('id')),
            href: window.location.href,
            route: currentRoutes.map((rr, key) => `${(key !== 0) ? ' > ' : ''}${rr.name}`).join(''),
            params: router.getCurrentParams(),
            query: router.getCurrentQuery()
        }, null ,4) + '\n```';
    },
    getRouteShape(item){
        if(item.childRoutes) {
            return Immutable.List(item.childRoutes).flatMap(this.getRouteShape);
        } else {
            return Immutable.List([{
                value: item.path, 
                label: this.renderLabel(item),
                route: item
            }]);
        }
    },
    getOptions() {
        return this.state.routes.flatMap(this.getRouteShape).sortBy(item => item.label).toJS();
    },
    validateParams() {
        return this.state.paramNames.map(item => this.state[item]).indexOf(undefined) === -1;
    },
    onKey(ee) {
        if(ee.shiftKey && ee.altKey && key.isPressed(ee, 'P')) {
            this.setState({
                visible: !this.state.visible
            }, this.onFocusSelect);
        } else if(ee.shiftKey && ee.altKey && key.isPressed(ee, 'B')) {
            alert(this.getTicketTable());
        } else if(key.isPressed(ee, 'return') &&  this.validateParams()) {
            this.onTransition();
        }
    },
    onChangeParam(ee, details) {
        this.setState({
            [details.key]: details.value
        });
    },
    onFocusSelect() {
        if(this.state.visible) {
            this.refs.selectElement.focus()
        }
    },
    onNavigate(url, details) {
        var {paramNames} = details[0].route;

        if(paramNames.length) {
            this.setState({
                stage: 2,
                paramNames: paramNames,
                url: url
            });
        } else {
            this.setState({
                url: url
            }, this.onTransition);
        }
        
    },
    onTransition() {
        var {url,paramNames} = this.state;
        if(paramNames) {
            paramNames.forEach(param => {
                url = url.replace(`:${param}`, this.state[param]);
            });
        }
        this.history.pushState(null, url);
        this.setState({
            visible: false,
            stage: 1
        });
    },
    renderLabel(item) {
        return <div>{item.name || item.path} <div className="t-muted t-small block">{item.path}</div></div>
    },
    render() {
        if(this.state.visible) {
            return (
                <div className="Modal">
                    <div className="Modal_content">
                        <div style={{width: 320}}>
                            {this[`renderStage_${this.state.stage}`]()}
                        </div>
                    </div>
                </div>
            );            
        } 
        return null;
    },
    renderStage_1() {
        return <ReactSelect ref="selectElement" options={this.getOptions()} onChange={this.onNavigate}/>;
    },
    renderStage_2() {
        return this.state.paramNames.map(param => {
            return <div key={param}>
                <Label>{param}</Label>
                <Input name={param} type="text" onChange={this.onChangeParam} />
            </div>
        });
    }
});

module.exports = GoAnywhere;