/* @flow */

import React from 'react';
import PropTypes from 'prop-types';

export default class ModalContent extends React.Component {

    static propTypes = {
        status: PropTypes.shape({
            title: PropTypes.node,
            message: PropTypes.node,
            yes: PropTypes.node,
            no: PropTypes.node
        }),
        step: PropTypes.shape({
            onYes: PropTypes.func,
            onNo: PropTypes.func
        }),
        classNameTitle: PropTypes.string,
        classNameBody: PropTypes.string,
        classNameButtonContainer: PropTypes.string,
        classNameButton: PropTypes.string,
        classNameButtonNo: PropTypes.string
    };

    static defaultProps = {
        classNameTitle: "Modal_title",
        classNameBody: "Modal_body",
        classNameButtonContainer: "Modal_buttonContainer",
        classNameButtonYes: "Button Button-primary",
        classNameButtonNo: "Button Button-secondary"
    };

    onNo = () => {
        this.props.nextSteps.onNo();
    };

    onYes = () => {
        this.props.nextSteps.onYes();
    };

    render(): React.Element<any> {
        const {
            classNameTitle,
            classNameBody,
            classNameButtonContainer,
            classNameButtonYes,
            classNameButtonNo,
            status: {
                title,
                message,
                yes,
                no
            }
        } = this.props;

        return <div>
            {title && <div className={classNameTitle}>{title}</div>}
            <div className={classNameBody}>
                {message}
                <div className={classNameButtonContainer}>
                    {no && <button className={classNameButtonNo} onClick={this.onNo}>{no}</button>}
                    {yes && <button className={classNameButtonYes} onClick={this.onYes}>{yes}</button>}
                </div>
            </div>
        </div>;
    }
}
