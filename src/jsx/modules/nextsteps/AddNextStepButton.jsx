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
            <div className="AddNextStepButton">
                <button
                    className="btn btn-outline-secondary"
                    onClick={this.openModal}>
                    <i className="fa fa-plus"></i> Add Next Step
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
