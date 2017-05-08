import React, { PropTypes } from "react";
import Modal from "OneRoostModal";

const ModalButton = React.createClass({
    propTypes: {
        buttonClass: PropTypes.string,
        buttonText: PropTypes.string,
        containerClass: PropTypes.string,
        buttonIcon: PropTypes.string,
        modalTitle: PropTypes.string.isRequired,
        disabled: PropTypes.bool
    },
    getInitialState: function(){
        return {
            open: false
        }
    },
    getDefaultProps: function() {
        return {
            buttonText: "Open",
            buttonClass: "btn-default",
            buttonIcon: "",
            containerClass: "",
            disabled: false
        };
    },
    openModal: function(){
        this.refs.modal.openModal();
    },
    render () {        
        const {
            buttonIcon,
            containerClass,
            buttonClass,
            disabled,
            buttonText,
            modalTitle,
            children
        } = this.props
        let $buttonIcon = null
        if (buttonIcon) {
            $buttonIcon = <i className={"fa fa-" + buttonIcon}></i>;
        }
        return (
            <div className={"ModalButton " + containerClass}>
                <button className={"btn " + buttonClass }
                    onClick={this.openModal}
                    disabled={disabled}
                    >
                    {$buttonIcon}&nbsp;{buttonText}
                </button>
                <Modal
                    title={modalTitle}
                    ref="modal" >
                    {children}
                </Modal>
            </div>
        )
    }
})

export default ModalButton
