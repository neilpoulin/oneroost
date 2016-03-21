import React, { PropTypes } from 'react';
import Modal from './OneRoostModal';

const ModalButton = React.createClass({
    propTypes: {
        buttonClass: React.PropTypes.string,
        buttonText: React.PropTypes.string,
        containerClass: React.PropTypes.string,
        buttonIcon: React.PropTypes.string,
        modalTitle: React.PropTypes.string.isRequired
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
            containerClass: ""
        };
    },
    openModal: function(){
        this.refs.modal.openModal();
    },
    render () {
        var buttonClass = this.props.buttonClass;
        return (
            <div className={"ModalButton " + this.props.containerClass}>
                <button className={"btn " + this.props.buttonClass + " fa fa-" + this.props.buttonIcon}
                    onClick={this.openModal}
                    >
                    &nbsp;{this.props.buttonText}
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
