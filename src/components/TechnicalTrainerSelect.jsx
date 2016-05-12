var React = require('react');
var moment = require('moment');
var Reflux = require('reflux');
var StoreMixin = require('reflux-immutable/StoreMixin');
var {JAPANESE_FISCAL_YEAR} = require('trc-client-core/src/constants/QueryParameters');

var ParticipantStore = require('trc-client-core/src/participant/ParticipantStore');
var ParticipantActions = require('trc-client-core/src/participant/ParticipantActions');
var Select = require('trc-client-core/src/components/Select');

var ANY_TRAINER = [{
    value:'ANY_TRAINER', 
    label:'All Trainers'
}];

var TechnicalTrainerSelect = React.createClass({
    displayName: 'TechnicalTrainerSelect',
    mixins: [
        StoreMixin,
        Reflux.listenTo(ParticipantStore, 'onStoreChange')
    ],
    getStoreState() {
        return {
            technicalTrainers: ParticipantStore.get('technicalTrainers').toJS()
        };
    },
    getDefaultProps() {
        return {
            name: 'trainerName',
            regionCode: 'ALL_REGIONS',
            year: moment().year().toString(),
            year_type: JAPANESE_FISCAL_YEAR
        };
    },
    componentDidMount() {
        ParticipantStore.get('technicalTrainers');
        this.getData(this.props);
    },
    componentWillReceiveProps(nextProps) {
        if(
            this.props.year !== nextProps.year ||
            this.props.regionCode !== nextProps.regionCode ||
            this.props.year_type !== nextProps.year_type
        ) {
            this.getData(nextProps);
        }
    },
    getData(query) {
        ParticipantActions.fetchTechnicalTrainers({
            regionCode: query.regionCode,
            year_type: query.year_type,
            year: query.year
        });
    },
    getCurrentTrainers() {
        var trainerList = this.state.technicalTrainers
            .filter(tt => tt.region === this.props.regionCode || this.props.regionCode === 'ALL_REGIONS')
            .map(tt => ({value: tt.name, label: tt.name}));
        
        return ANY_TRAINER.concat(trainerList);
    },
    render: function() {
        return (
            <Select queryString name={this.props.name} value={this.props.value} options={this.getCurrentTrainers()} onChange={this.props.onChange}></Select>
        );
    }

});

module.exports = TechnicalTrainerSelect;