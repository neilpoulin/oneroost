define(['react', 'parse', 'parse-react', 'deal/StakeholderModal'], function(React, Parse, ParseReact, StakeholderModal){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function(){
            return {};
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
                        ref="addStakeholderModal">
                    </StakeholderModal>
                </div>
            );
        }
    });
});
