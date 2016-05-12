import BaseComponent from 'trc-client-core/src/components/BaseComponent';

class Toggle extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            active: props.defaultActive
        };
    }
    onToggle() {
        this.setState({
            active: !this.state.active
        });
    }
    render() {
        return <div>
            <div onClick={this.onToggle}>{this.renderButton()}</div>
            <div>{this.renderChildren()}</div>
        </div>;
    }
    renderButton() {
        var {button, activeButton} = this.props;
        return this.state.active ? activeButton : button;
    }
    renderChildren() {
        if(this.state.active) {
            return this.props.children;
        }
    }
}

Toggle.displayName = 'Toggle';
Toggle.defaultProps = {
    defaultActive: true
};

export default Toggle;
