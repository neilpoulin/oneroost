import React from 'react';
import Parse from 'parse';

import ModalButton from './../util/ModalButton';
import NextStepForm from './NextStepForm';

export default React.createClass({
    getInitialState: function(){
        return {};
    },
    getDefaultProps: function(){
        return {
            btnClassName: 'btn-outline-secondary',
            modalTitle: 'Add Next Step'
        }
    },
    openModal: function(){
        this.refs.nextStepModal.openModal();
    },
    render: function()
    {
        return (
            <ModalButton
                buttonText="Add Next Step"
                buttonIcon="plus"
                containerClass="AddNextStepButton"
                buttonClass={this.props.btnClassName}
                modalTitle={this.props.modalTitle}
                >
                <NextStepForm
                    ref="addNextStepForm"
                    deal={this.props.deal} />
            </ModalButton>
        )
    }
});
