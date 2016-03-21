import React, { PropTypes } from 'react'
import ModalButton from './../util/ModalButton';
import CreateAccountForm from './CreateAccountForm';

const AddAccountButton = React.createClass({
    openModal: function(){
        this.refs.modal.openModal()
    },
    getDefaultProps: function(){
        return {
            btnClassName: 'btn-outline-success'
        }
    },
    render () {
        return (
            <ModalButton
                buttonText="Testing"
                buttonIcon="usd"
                containerClass="AddAccountButton"
                buttonClass={this.props.btnClassName}
                modalTitle="Create Account"
                >
                <CreateAccountForm/>
            </ModalButton>
        )
    }
})

export default AddAccountButton
