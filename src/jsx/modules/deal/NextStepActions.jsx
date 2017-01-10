import React, { PropTypes } from "react"
import Parse from "parse"
import NextStepDeleteButton from "NextStepDeleteButton"
import NextStepSaveButton from "NextStepSaveButton"
import NextStepEditButton from "NextStepEditButton"
import NextStepStatusChangeButton from "NextStepStatusChangeButton"
import NextStepCancelButton from "NextStepCancelButton"

const NextStepActions = React.createClass({
    propTypes: {
        step: PropTypes.instanceOf(Parse.Object).isRequired,
        isEdit: PropTypes.bool.isRequired,
        handleSave: PropTypes.func,
        handleEdit: PropTypes.func,
        afterDelete: PropTypes.func,
        handleCancel: PropTypes.func
    },
    getDefaultProps(){
        return {
            isEdit: false,
            afterDelete: function(){
                console.log("no after delete function specified");

            },
            handleSave: function(){
                console.log("no handleSave function specified");
            },
            handleEdit: function(){
                console.log("no handleEdit function specified");
            },
            handleCancel: function(){
                console.log("no handleCancel was specified");
            }
        }
    },
    getStateChangeButton(){
        return <NextStepStatusChangeButton
            step={this.props.step}
            deal={this.props.deal}
            key={"next_step_action_status_" + this.props.step.id}/>
    },
    getEditButton(){
        return <NextStepEditButton handleEdit={this.props.handleEdit}
            key={"next_step_action_edit_" + this.props.step.id}/>
    },
    getSaveButton(){
        return <NextStepSaveButton step={this.props.step}
            handleSave={this.props.handleSave} key={"next_step_action_save_" + this.props.step.id}/>
    },
    getDeleteButton(){
        return <NextStepDeleteButton step={this.props.step}
            afterDelete={this.props.afterDelete} key={"next_step_action_delete_" + this.props.step.id}/>
    },
    getCancelButton(){
        return <NextStepCancelButton handleCancel={this.props.handleCancel} key={"next_step_action_cancel_" + this.props.step.id} />
    },
    render () {
        var actions = [];

        if ( this.props.isEdit ){
            actions.push( this.getCancelButton() );
            actions.push( this.getDeleteButton() );
            actions.push( this.getSaveButton() );
        }
        else {
            actions.push( this.getEditButton() );
            actions.push( this.getStateChangeButton() );
        }

        return (
            <div className="actionsBar">
                {actions.map(function(action){
                    return action;
                })}
            </div>);
    }
})

export default NextStepActions
