import React from 'react';
import ParseReact from 'parse-react'
import StakeholderModal from './StakeholderModal'
import LinkedStateMixin from 'react-addons-linked-state-mixin'

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            deal: this.props.deal
        };
    },
    openModal: function(){
        this.refs.addStakeholderModal.openModal();
    },
    render: function(){
        return (
            <div className="container">
                <button className="btn btn-primary"
                    onClick={this.openModal}>
                    Add Stakeholder
                </button>
                <StakeholderModal
                    deal={this.state.deal}
                    ref="addStakeholderModal">
                </StakeholderModal>
            </div>
        );
    }
});
