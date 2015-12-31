define(['react', 'parse', 'next-steps/CreateNextStepModal'], function( React, Parse, CreateNextStepModal ){
    return React.createClass({
        getInitialState: function(){
            return {};
        },
        openModal: function(){
            this.refs.nextStepModal.openModal();
        },
        render: function()
        {
            return (
                <div className="">
                    <button className="btn btn-primary"
                        onClick={this.openModal}>
                        Add Next Step
                    </button>
                    <CreateNextStepModal
                        ref="nextStepModal"
                        deal={this.props.deal}
                    ></CreateNextStepModal>
                </div>
            );
        }
    })
});
