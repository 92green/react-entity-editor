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
            open,
            title,
            message,
            yes,
            no
        } = this.props;

        return <ReactModal
            isOpen={open}
            onRequestClose={this.onNo.bind(this)}
            className="Modal_content"
            overlayClassName="Modal"
            contentLabel={title || (no ? "Confirm" : "Alert")}>
            {title && <div className="Modal_title">{title}</div>}
            <div className="Modal_body">
                {message}
                <div className="Modal_buttons">
                    {yes ? <a className="Button" onClick={this.onYes.bind(this)}>{yes}</a> : null}
                    {no ? <a className="Button Button-grey" onClick={this.onNo.bind(this)}>{no}</a> : null}
                </div>
            </div>
        </ReactModal>;
    }
}

Modal.propTypes = {
    message: PropTypes.any,
    title: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
    open: PropTypes.bool,
    onYes: PropTypes.func,
    onNo: PropTypes.func,
    onRequestClose: PropTypes.func
};

export default Modal;
