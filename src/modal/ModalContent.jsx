/* @flow */

import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';

function ModalContent(props): React.Element<any> {
    const {
        title,
        message,
        yes,
        no,
        onYes,
        onNo,
        classNames
    } = props;

    return <div>
        {title && <div className={classNames.modalTitle}>{title}</div>}
        <div className={classNames.modalBody}>
            {message}
            <div className={classNames.modalButtonContainer}>
                {yes ? <button className={classNames.modalButton} onClick={onYes.bind(this)}>{yes}</button> : null}
                {no ? <button className={classNames.modalButtonSecondary} onClick={onNo.bind(this)}>{no}</button> : null}
            </div>
        </div>
    </div>;
}

ModalContent.propTypes = {
    title: PropTypes.string,
    message: PropTypes.node,
    yes: PropTypes.string,
    no: PropTypes.string,
    onYes: PropTypes.func,
    onNo: PropTypes.func,
    classNames: PropTypes.shape({
        modalTitle: PropTypes.string,
        modalBody: PropTypes.string,
        modalButtonContainer: PropTypes.string,
        modalButton: PropTypes.string,
        modalButtonSecondary: PropTypes.string
    })
};

ModalContent.defaultProps = {
    classNames: {
        modalTitle: "Modal_title",
        modalBody: "Modal_body",
        modalButtonContainer: "Modal_buttonContainer",
        modalButton: "Button",
        modalButtonSecondary: "Button Button-grey"
    }
};

export default ModalContent;
