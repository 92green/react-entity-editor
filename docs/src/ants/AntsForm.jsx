import React, {Component, PropTypes} from 'react';

class AntsForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {}
        };

        // bind methods to this class
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentWillMount() {
        this.setupForm(this.props.ant);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.ant !== nextProps.ant) {
            this.setupForm(nextProps.ant);
        }
    }

    componentWillUnmount() {
        // if the form unmounts, mark the form as no longer dirty
        this.props.onDirty(false);
    }

    setupForm(ant) {
        // set up form on mount, or when the ant changes
        const fields = ['name', 'legs'];
        var form = {};
        fields.forEach(field => {
            form[field] = ant ? ant[field] : "";
        });

        this.setState({form});

        // mark the form as clean
        this.props.onDirty(false);
    }

    handleChangeField(field) {
        return (event) => {
            // set the new state of the form
            var form = Object.assign({}, this.state.form);
            form[field] = event.target.value;
            this.setState({form});

            // when a change is made, mark the form as dirty
            // (this is a little crude, it should only mark the form as dirty
            // if the form state differs from its original state)
            this.props.onDirty(true);
        };
    }

    handleSave() {
        this.props.onSave(this.state.form);
    }

    render() {
        return <div>
            <div className="InputRow">
                <label htmlFor="name">Name</label>
                <input
                    value={this.state.form.name}
                    onChange={this.handleChangeField('name')}
                    id="name"
                />
            </div>
            <div className="InputRow">
                <label htmlFor="legs">Legs</label>
                <input
                    value={this.state.form.legs}
                    onChange={this.handleChangeField('legs')}
                    id="legs"
                />
            </div>
            <button
                children="Save"
                className="Button Button-primary"
                onClick={this.handleSave}
                disabled={!this.props.canSave}
            />
        </div>;
    }
}

AntsForm.propTypes = {
    ant: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        legs: PropTypes.string
    }),
    onSave: PropTypes.func,
    onDirty: PropTypes.func,
    canSave: PropTypes.bool
};

export default AntsForm;
