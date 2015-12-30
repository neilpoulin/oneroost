define(['react', 'parse', 'models/NextStep'], function( React, Parse, NextStep ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function(){
            return {
                title: null,
                description: null,
                dueDate: null,
                createdBy: Parse.User.current(),
                assignedUser: null,
                deal: this.props.deal,
                completedDate: null
            };
        },
        saveNextStep: function(){
            var component = this;
            var nextStep = new NextStep();
            nextStep.set("createdBy", this.state.createdBy);
            nextStep.set("title", this.state.title);
            nextStep.set("description", this.state.description);
            nextStep.set("dueDate", new Date( this.state.dueDate) );
            nextStep.set("assignedUser", this.state.assignedUser);
            nextStep.set("deal", this.state.deal);
            nextStep.set("completedDate", ( this.state.completedDate != null ? new Date( this.state.completedDate) : null ) );
            nextStep.save(null, {
                success: function( step ){
                    console.log("successfully saved next step");
                    component.saveSuccess();
                },
                error: function(){
                    console.error("failed to save next step");
                }
            })
        },
        saveSuccess: function(){
            this.props.saveSuccess();
        },
        render: function(){
            return (
                <div className="NextStepsFormContainer">
                    <div className="form-component">
                        <label for="nextStepTitle">Title</label>
                        <input id="nextStepTitle"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('title')} />
                    </div>
                    <div className="form-component">
                        <label for="nextStepDescription">Description</label>
                        <input id="nextStepDescription"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('description')} />
                    </div>
                    <div className="form-component">
                        <label for="nextStepDueDate">Due Date</label>
                        <input id="nextStepDueDate"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('dueDate')} />
                    </div>
                    <div className="form-component">
                        <label for="nextStepAssignedUser">Assigned User</label>
                        <input id="nextStepAssignedUser"
                            type="text"
                            className="form-control"
                            valueLink={this.linkState('assignedUser')} />
                    </div>
                </div>
            );
        }
    })
});
