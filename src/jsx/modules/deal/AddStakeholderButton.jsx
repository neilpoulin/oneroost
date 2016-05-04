import React from "react";
import StakeholderModal from "./StakeholderModal"
import LinkedStateMixin from "react-addons-linked-state-mixin"

export default React.createClass({
    mixins: [LinkedStateMixin],
    openModal: function(){
        this.refs.addStakeholderModal.openModal();
    },
    render: function(){
        var btnClass = this.props.btnClassName || "btn-outline-secondary";
        var btn =
        <div className="AddStakeholderButton">
            <div className="text-center">
                <button className={"btn " + btnClass}
                    onClick={this.openModal}>
                    Add Stakeholder
                </button>
            </div>
            <StakeholderModal
                deal={this.props.deal}
                onSuccess={this.props.onSuccess}
                ref="addStakeholderModal">
            </StakeholderModal>
        </div>
        return btn;
    }
});
