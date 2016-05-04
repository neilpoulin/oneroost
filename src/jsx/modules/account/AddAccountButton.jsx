import React, { PropTypes } from "react"
import ModalButton from "./../util/ModalButton";
import CreateAccountForm from "./CreateAccountForm";

const AddAccountButton = React.createClass({
    openModal: function(){
        this.refs.modal.openModal()
    },
    propTypes: {
        onSuccess: PropTypes.func,
        btnClassName: PropTypes.string
    },
    getDefaultProps: function(){
        return {
            btnClassName: "btn-outline-success",
            onSuccess: function(){ console.log("this is the default function from AddAccountButton"); }
        }
    },
    render () {
        return (
            <ModalButton
                buttonText="Create Account"
                buttonIcon="plus"
                containerClass="AddAccountButton"
                buttonClass={this.props.btnClassName}
                modalTitle="Create Account"
                >
                <CreateAccountForm
                    onSuccess={this.props.onSuccess}
                />
            </ModalButton>
        )
    }
})

export default AddAccountButton
