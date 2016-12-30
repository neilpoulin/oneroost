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
        var buttonIcon = null;
        if ( this.props.buttonIcon )
        {
            buttonIcon = <i className={"fa fa-" + this.props.buttonIcon}></i>;
        }
        return (
            <div className={"ModalButton " + this.props.containerClass}>
                <button className={"btn " + this.props.buttonClass }
                    onClick={this.openModal}
                    disabled={this.props.disabled}
                    >
                    {buttonIcon}&nbsp;{this.props.buttonText}
                </button>
                <Modal
                    title={this.props.modalTitle}
                    ref="modal" >
                    {this.props.children}
                </Modal>
            </div>
        )
    }
})

export default ModalButton
