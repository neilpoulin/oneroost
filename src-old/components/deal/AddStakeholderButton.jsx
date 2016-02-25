define(['react', 'parse', 'parse-react', 'deal/StakeholderModal'], function(React, Parse, ParseReact, StakeholderModal){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
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
});
