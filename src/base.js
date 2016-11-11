import React, { Component, PropTypes, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import CloseIcon from 'ffe-icons-react/kryss-ikon';

export default class Base extends Component {

    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }

    close() {
        const { onClose } = this.props;
        const element = findDOMNode(this.refs.self);
        element.style.height = `${element.offsetHeight}px`;
        setTimeout(() => {
            element.style.height = 0;
            onClose();
        }, 50);
    }

    render() {
        const {
            children,
            icon,
            messageType,
            style,
            header,
        } = this.props;

        return (
            <div
                className={`ffe-context-message-wrapper ffe-context-message-wrapper--${messageType}`}
                ref="self"
                style={style}
            >
                <div className="ffe-context-message">
                    <div className="ffe-context-message__icon">
                        {cloneElement(icon, { className: 'ffe-context-message__icon-svg' })}
                    </div>

                    <div>
                        {header && <header className="ffe-h5">{header}</header>}
                        <div className="ffe-body-text">
                            {children}
                        </div>
                    </div>
                </div>
                <button
                    className="ffe-context-message__close-button"
                    tabIndex="0"
                    aria-label="Lukk"
                    onClick={this.close}
                >
                    <CloseIcon className="ffe-context-message__close-button-svg" />
                </button>
            </div>
        );
    }
}

Base.propTypes = {
    children: PropTypes.node.isRequired,
    header: PropTypes.string,
    messageType: PropTypes.oneOf(['info', 'tip']).isRequired,
    icon: PropTypes.element.isRequired,
    style: PropTypes.object,
    onClose: PropTypes.func,
};

