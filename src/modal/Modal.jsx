/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

class Modal extends Component {
    render(): React.Element<any> {
        const {
            children,
            open,
            title,
            no,
            onYes,
            onNo,
            classNameModal,
            classNameContent
        } = this.props;

        var propsForChildren: Object = {
            onYes,
            onNo
        };

        const childrenWithProps: React.Element<any> = React.Children.map(children, kid => React.cloneElement(kid, propsForChildren));

        return <ReactModal
            isOpen={open}
            onRequestClose={onNo}
            className={classNameContent}
            overlayClassName={classNameModal}
            contentLabel={title || (no ? "Confirm" : "Alert")}
            children={childrenWithProps}
        />;
    }
}

Modal.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
    onYes: PropTypes.func,
    onNo: PropTypes.func,
    onRequestClose: PropTypes.func,
    classNameModal: PropTypes.string,
    classNameContent: PropTypes.string
};

Modal.defaultProps = {
    classNameModal: "Modal",
    classNameContent: "Modal_content"
};

export default Modal;
