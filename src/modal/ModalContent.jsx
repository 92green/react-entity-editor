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
            classNameTitle,
            classNameBody,
            classNameButtonContainer,
            classNameButtonYes,
            classNameButtonNo
        } = this.props;

        return <div>
            {title && <div className={classNameTitle}>{title}</div>}
            <div className={classNameBody}>
                {children}
                <div className={classNameButtonContainer}>
                    {no ? <button className={classNameButtonNo} onClick={onNo}>{no}</button> : null}
                    {yes ? <button className={classNameButtonYes} onClick={onYes}>{yes}</button> : null}
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
    classNameTitle: PropTypes.string,
    classNameBody: PropTypes.string,
    classNameButtonContainer: PropTypes.string,
    classNameButton: PropTypes.string,
    classNameButtonNo: PropTypes.string
};

ModalContent.defaultProps = {
    classNameTitle: "Modal_title",
    classNameBody: "Modal_body",
    classNameButtonContainer: "Modal_buttonContainer",
    classNameButtonYes: "Button Button-primary",
    classNameButtonNo: "Button Button-secondary"
};

export default ModalContent;
