import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

class Modal extends Component {

    onYes() {
        if(this.props.onYes) {
            this.props.onYes();            
        }
        this.props.onRequestClose();
    }
    onNo() {
        if(this.props.onNo) {
            this.props.onNo();            
        }
        this.props.onRequestClose();
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
            <div className="Modal_title">{title}</div>
            <div className="Modal_body">
                {children}
                <div className="t-right">
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
    yes: PropTypes.string,
    no: PropTypes.string,
    onYes: PropTypes.func,
    onNo: PropTypes.func,
    title: PropTypes.string
};

Modal.defaultProps = {
    title: 'Confirm',
    yes: 'Yes',
    no: 'Cancel'
};

export default Modal;