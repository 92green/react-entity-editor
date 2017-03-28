/* @flow */

import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

class Modal extends Component {

    onYes(): void {
        this.props.onRequestClose();
        if(this.props.onYes) {
            setTimeout(this.props.onYes, 1);
            // when onYes causes entity editor to unmount, if we call this synchronously then react-modal doesn't unmount properly causing a React invariant error
        }
    }

    onNo(): void {
        this.props.onRequestClose();
        if(this.props.onNo) {
            setTimeout(this.props.onNo, 1);
            // when onNo causes entity editor to unmount, if we call this synchronously then react-modal doesn't unmount properly causing a React invariant error
        }
    }

    render(): React.Element<any> {
        const {
            children,
            open,
            title,
            no,
            classNames
        } = this.props;

        var propsForChildren: Object = {
            onYes: this.onYes.bind(this),
            onNo: this.onNo.bind(this)
        };

        delete propsForChildren.open;
        delete propsForChildren.onRequestClose;

        const childrenWithProps: React.Element<any> = React.Children.map(children, kid => React.cloneElement(kid, propsForChildren));

        return <ReactModal
            isOpen={open}
            onRequestClose={this.onNo.bind(this)}
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
