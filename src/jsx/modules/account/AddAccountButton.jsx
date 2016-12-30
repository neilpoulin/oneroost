import React, { PropTypes } from "react"
import ModalButton from "ModalButton";
import CreateAccountForm from "account/CreateAccountForm";

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
            btnClassName: "btn-outline-primary",
            onSuccess: function(){ console.log("this is the default function from AddAccountButton"); }
        }
    },
    render () {
        return (
            <ModalButton
                buttonText="Create Opportunity"
                buttonIcon="plus"
                containerClass="AddAccountButton"
                buttonClass={this.props.btnClassName}
                modalTitle="Add an Opportunity"
                >
                <CreateAccountForm
                    onSuccess={this.props.onSuccess}
                />
            </ModalButton>
        )
    }
})

export default AddAccountButton
