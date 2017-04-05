/* @flow */

import React, { Component, PropTypes } from 'react';
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
            classNames
        } = this.props;

        var propsForChildren: Object = {
            onYes,
            onNo
        };

        const childrenWithProps: React.Element<any> = React.Children.map(children, kid => React.cloneElement(kid, propsForChildren));

        return <ReactModal
            isOpen={open}
            onRequestClose={onNo}
            className={classNames.modalContent}
            overlayClassName={classNames.modal}
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
    classNames: PropTypes.shape({
        modal: PropTypes.string,
        modalContent: PropTypes.string
    })
};

Modal.defaultProps = {
    classNames: {
        modal: "Modal",
        modalContent: "Modal_content",
        modalTitle: "Modal_title",
        modalBody: "Modal_body",
        modalButtonContainer: "Modal_buttonContainer",
        modalButton: "Button",
        modalButtonSecondary: "Button Button-grey"
    }
};

export default Modal;
