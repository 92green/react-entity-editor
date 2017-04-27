/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ModalContent extends Component {
    render(): React.Element<any> {
        const {
            title,
            children,
            yes,
            no,
            onYes,
            onNo,
            classNames
        } = this.props;

        return <div>
            {title && <div className={classNames.modalTitle}>{title}</div>}
            <div className={classNames.modalBody}>
                {children}
                <div className={classNames.modalButtonContainer}>
                    {no ? <button className={classNames.modalButtonSecondary} onClick={onNo}>{no}</button> : null}
                    {yes ? <button className={classNames.modalButton} onClick={onYes}>{yes}</button> : null}
                </div>
            </div>
        </div>;
    }
}

ModalContent.propTypes = {
    title: PropTypes.string,
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
        modalButton: "Button Button-primary",
        modalButtonSecondary: "Button Button-secondary"
    }
};

export default ModalContent;
