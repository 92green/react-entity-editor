import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

class Modal extends Component {

    onYes() {
        this.props.onRequestClose();
        if(this.props.onYes) {
            setTimeout(this.props.onYes, 1);
            // when onYes causes entity editor to unmount, if we call this synchronously then react-modal doesn't unmount properly causing a React invariant error
        }
    }

    onNo() {
        this.props.onRequestClose();
        if(this.props.onNo) {
            setTimeout(this.props.onNo, 1);
            // when onNo causes entity editor to unmount, if we call this synchronously then react-modal doesn't unmount properly causing a React invariant error
        }
    }

    render() {
        const {
            // react component props
            children,
            // props for react modal
            isOpen,
            onAfterOpen,
            onRequestClose,
            // props for this component
            title,
            yes,
            no,
            onYes,
            onNo
        } = this.props;

        return <ReactModal
            isOpen={isOpen}
            onAfterOpen={onAfterOpen}
            onRequestClose={this.onNo.bind(this)}
            className="Modal_content"
            overlayClassName="Modal">
            {title && <div className="Modal_title">{title}</div>}
            <div className="Modal_body">
                {children}
                <div className="Modal_buttons">
                    {no ? <a className="Button Button-grey " onClick={this.onNo.bind(this)}>{no}</a> : null}
                    {yes ? <a className="Button" onClick={this.onYes.bind(this)}>{yes}</a> : null}
                </div>
            </div>
        </ReactModal>;
    }
}

Modal.propTypes = {
    // props for react modal
    isOpen: PropTypes.bool,
    onAfterOpen: PropTypes.func,
    onRequestClose: PropTypes.func,
    // props for this component
    title: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
    onYes: PropTypes.func,
    onNo: PropTypes.func,
    type: PropTypes.string
};

Modal.defaultProps = {
    title: 'Message',
    yes: 'Okay',
    no: null
};

export default Modal;
