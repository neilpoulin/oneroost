import React from 'react';
import Parse from 'parse';
import CreateNextStepModal from './CreateNextStepModal';

export default React.createClass({
    getInitialState: function(){
        return {};
    },
    openModal: function(){
        this.refs.nextStepModal.openModal();
    },
    render: function()
    {
        return (
            <div className="container">
                <button
                    className="btn btn-outline-primary"
                    onClick={this.openModal}>
                    Add Next Step
                </button>
                <CreateNextStepModal
                    ref="nextStepModal"
                    deal={this.props.deal}
                    >
                </CreateNextStepModal>
            </div>
        );
    }
});
