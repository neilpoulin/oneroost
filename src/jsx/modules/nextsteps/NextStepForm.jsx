import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import NextStep from './../../models/NextStep';
import LinkedStateMixin from 'react-addons-linked-state-mixin'


export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            title: null,
            description: null,
            dueDate: null,
            createdBy: Parse.User.current(),
            assignedUser: null,
            deal: this.props.deal,
            completedDate: null,
            user: Parse.User.current()
        };
    },
    saveNextStep: function(){
        var component = this;
        var step = {
            "createdBy": this.state.createdBy,
            "title": this.state.title,
            "description": this.state.description,
            "dueDate": new Date( this.state.dueDate ),
            "assignedUser": this.state.assignedUser,
            "deal": this.state.deal,
            "completedDate": ( this.state.completedDate != null ? new Date( this.state.completedDate ) : null )
        }
        ParseReact.Mutation.Create('NextStep', step)
        .dispatch()
        .then( function( step ){
            component.addStepCreatedComment( step );
        });
        component.clear();
    },
    addStepCreatedComment: function( step ){
        var self = this;
        var message = self.state.user.get("username") + " created Next Step: " + step.title;
        var comment = {
            deal: self.state.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        };
        ParseReact.Mutation.Create('DealComment', comment).dispatch();
    },
    clear: function(){
        this.setState( this.getInitialState() );
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
});
