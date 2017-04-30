import React, {Component, PropTypes} from 'react';

class DogsForm extends Component {

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
        this.setupForm(this.props.dog);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.dog !== nextProps.dog) {
            this.setupForm(nextProps.dog);
        }
    }

    componentWillUnmount() {
        // if the form unmounts, mark the form as no longer dirty
        this.props.onDirty(false);
    }

    setupForm(dog) {
        // set up form on mount, or when the dog changes
        const fields = ['name', 'toy'];
        var form = {};
        fields.forEach(field => {
            form[field] = dog ? dog[field] : "";
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
                <label htmlFor="toy">Toy</label>
                <input
                    value={this.state.form.toy}
                    onChange={this.handleChangeField('toy')}
                    id="toy"
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

DogsForm.propTypes = {
    dog: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        toy: PropTypes.string
    }),
    onSave: PropTypes.func,
    onDirty: PropTypes.func,
    canSave: PropTypes.bool
};

export default DogsForm;
