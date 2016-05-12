import React from 'react';
import Strings from 'trc/utils/Strings';

var IconSelect = React.createClass({
    displayName: 'IconSelect',
    getInitialState() {
        return {
            icon: this.props.defaultValue || this.props.value
        };
    },
    componentWillReceiveProps (nextProps) {
        this.setState({
            icon: nextProps.value
        });
    },
    onToggle(icon, ee) {
        var {onChange, onChangeString} = this.props;

        this.setState({
            icon: icon
        });        

        if (onChange) {
            if(onChangeString) {
                onChange(icon);
            } else {
                onChange(ee, {
                    key: this.props.name,
                    value: icon
                });
            }           
        }
    },
    render() {

        var error;
        if(this.props.error) {
            error = <div className="error">{this.props.error}</div>;
        }
        
        return (
            <div className="IconSelect row-bottom">
                <ul className="IconSelect_list">
                    {this.renderIcons()}
                </ul>
                {error}
            </div>
        );
    },    
    renderSelected () {
        return <span className="Icon" data-icon={String.fromCharCode(this.props.value)}></span>;
    },
    renderIcons () {
        return Object.keys(this.props.icons).map(key => {
            var iconObject = this.props.icons[key];
            var icon = iconObject.icon || iconObject;
            var unicodes = '';
            var selected;

            if(parseInt(icon, 16) > 57344) {
                unicodes = Strings.getUnicodeCharacter(parseInt(key, 16));
            } else {
                unicodes = icon;
            }

            selected = (this.state.icon === icon) ? ' is-selected' : '';


            return <li 
                className={"IconSelect_item Icon" + selected} 
                data-icon={unicodes} 
                onClick={this.onToggle.bind(this, icon)}
                title={iconObject.name}
                key={key}>
            </li>;
        });
    }
});

module.exports = IconSelect;