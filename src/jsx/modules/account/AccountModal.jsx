import React, { PropTypes } from 'react'
import {Modal, ModalClose} from 'react-modal-bootstrap';
import CreateAccountForm from './CreateAccountForm';

const AccountModal = React.createClass({
    getInitialState: function(){
        return {
            isOpen: false
        }
    },
    hideModal: function(){
        this.setState({
            isOpen: false
        });
        this.clearAddAccountForm();
    },
    openModal: function(){
        this.setState({
            isOpen: true
        });
    },
    showError: function(message){
        alert(message);
    },
    clearAddAccountForm: function(){
        this.refs.createAccountForm.setState( this.refs.createAccountForm.getInitialState() );
    },
    submit: function(){
        console.log("saving account...");
        this.refs.createAccountForm.doSubmit();
        this.hideModal();
    },
    render () {
        return (
            <Modal
                ref="addAccountModal"
                isOpen={this.state.isOpen}
                onRequestHide={this.hideModal}
                >
                <div className='modal-header'>
                    <ModalClose onClick={this.hideModal}/>
                    <h4 className='modal-title'>Create an Account</h4>
                </div>
                <div className="modal-body">
                    <CreateAccountForm ref="createAccountForm" />
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-default' onClick={this.hideModal}>
                        Cancel
                    </button>
                    <button className='btn btn-primary' onClick={this.submit}>
                        Create Account
                    </button>
                </div>
            </Modal>
        )
    }
})

export default AccountModal
