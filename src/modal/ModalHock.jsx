/* @flow */

import React, {Component} from 'react';

export default (): Function => {
    return (ComposedComponent): ReactClass<any> => {

        class ModalDecorator extends Component {

            /*
             * render
             */

            render(): React.Element<any> {
                console.log(this.props); //? TODO THIS:LLL BE COOOOL
                return <ComposedComponent {...this.props}/>;
            }
        }

        return ModalDecorator;
    }
};
