
var React = require('react');
var Reflux = require('reflux');

var ClassMixin = require('bd-stampy/mixins/ClassMixin');
var LoadingActions = require('trc-client-core/src/global/LoadingActions');
var LoadingStore = require('trc-client-core/src/global/LoadingStore');
var Loader = require('trc-client-core/src/components/Loader');

var StoreMixin = require('reflux-immutable/StoreMixin');

var LoadingManagerView = React.createClass({
    displayName: 'LoadingManagerView',
    mixins: [
        Reflux.listenTo(LoadingStore, 'onStoreChange'),
        StoreMixin,
        ClassMixin
    ],
    getStoreState() {
        return {
            loading: LoadingStore.get('loading'),
            type: LoadingStore.get('type'),
            message: LoadingStore.get('message')
        };
    },
    onClick() {
        LoadingActions.clearAll();
    },
    render() {
        var classes = this.createClassName('LoadingManager')
            .add(!this.state.loading, 'is-hidden');

        if(this.state.type) {
            this.state.type.split(' ').forEach((tt) => {
                classes.modifier(tt);
            });            
        }

        return (
            <div className={classes.className} onClick={this.onClick} data-message={this.state.message}>
                {this.state.message ? null : <Loader modifier="fullscreen"/>}
            </div>
        );
    }
});

module.exports = LoadingManagerView;