import React from 'react';
import Parse from 'parse';
import NextStepForm from './NextStepForm';
import {Modal, ModalClose} from 'react-modal-bootstrap'

export default React.createClass({
    getInitialState: function(){
        return {
            deal: this.props.deal,
            isOpen: false
        };
    },
    hideModal: function(){
        this.setState({
            isOpen: false
        });
        this.refs.addNextStepForm.clear();
    },
    openModal: function(){
        this.setState({
            isOpen: true
        });
    },
    submit: function(){
        this.refs.addNextStepForm.saveNextStep();
        this.hideModal();
    },
    render: function(){
        var nextStepForm = (
            <NextStepForm
                ref="addNextStepForm"
                deal={this.state.deal} />
        );

        return (
            <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal}>
                <div className='modal-header'>
                    <ModalClose onClick={this.hideModal}/>
                    <h4 className='modal-title'>Add a Next Step</h4>
                </div>
                <div className="modal-body">
                    {nextStepForm}
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-default' onClick={this.hideModal}>
                        Cancel
                    </button>
                    <button className='btn btn-primary' onClick={this.submit}>
                        Add
                    </button>
                </div>
            </Modal>
        )
    }
});
