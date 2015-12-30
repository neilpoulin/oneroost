define(['react', 'parse', 'examples/BootstrapModal', 'next-steps/NextStepForm'], function( React, Parse, BootstrapModal, NextStepForm ){
    return React.createClass({
        getInitialState: function(){
            return {
                deal: this.props.deal
            };
        },
        openModal: function(){
            this.refs.addNextStepModal.open();
        },
        closeModal: function(){
            this.refs.addNextStepModal.close();
            this.clearModalForm();
        },
        clearModalForm: function(){
            this.refs.addNextStepForm.setState( this.refs.addNextStepForm.getInitialState() );
            // this.refs.addNextStepForm.render();
        },
        modalCancel: function(){
            this.closeModal();
        },
        modalConfirm: function(){
            this.refs.addNextStepForm.saveNextStep();
            this.props.onSuccess();
            this.closeModal();
        },
        nextStepCreated: function(){
            //form will be cleared on close
        },
        render: function(){
            var nextStepForm = (
                <NextStepForm
                ref="addNextStepForm"
                deal={this.state.deal}
                saveSuccess={this.nextStepCreated} />
            );

            return (
                <BootstrapModal
                    ref="addNextStepModal"
                    confirm="Add"
                    cancel="Cancel"
                    onCancel={this.modalCancel}
                    onConfirm={this.modalConfirm}
                    title={'Add a Next Step for ' + this.state.deal.get('dealName')} >
                    {nextStepForm}
                </BootstrapModal>
            )
        }
    });
});
