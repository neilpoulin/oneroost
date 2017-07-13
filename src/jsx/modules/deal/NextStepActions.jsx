import React from "react"
import PropTypes from "prop-types"
import NextStepDeleteButton from "NextStepDeleteButton"
import NextStepSaveButton from "NextStepSaveButton"
import NextStepEditButton from "NextStepEditButton"
import NextStepStatusChangeButton from "NextStepStatusChangeButton"
import NextStepCancelButton from "NextStepCancelButton"
import * as log from "LoggingUtil"

const NextStepActions = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        isEdit: PropTypes.bool.isRequired,
        handleSave: PropTypes.func,
        handleEdit: PropTypes.func,
        afterDelete: PropTypes.func,
        handleCancel: PropTypes.func,
        updateStep: PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            isEdit: false,
            afterDelete: function(){
                log.info("no after delete function specified");

            },
            handleSave: function(){
                log.info("no handleSave function specified");
            },
            handleEdit: function(){
                log.info("no handleEdit function specified");
            },
            handleCancel: function(){
                log.info("no handleCancel was specified");
            }
        }
    },
    getStateChangeButton(){
        return <NextStepStatusChangeButton
            step={this.props.step}
            deal={this.props.deal}
            key={"next_step_action_status_" + this.props.step.objectId}
            updateStep={this.props.updateStep}/>
    },
    getEditButton(){
        return <NextStepEditButton handleEdit={this.props.handleEdit}
            key={"next_step_action_edit_" + this.props.step.objectId}/>
    },
    getSaveButton(){
        return <NextStepSaveButton step={this.props.step}
            handleSave={this.props.handleSave} key={"next_step_action_save_" + this.props.step.objectId}/>
    },
    getDeleteButton(){
        return <NextStepDeleteButton step={this.props.step}
            afterDelete={this.props.afterDelete} key={"next_step_action_delete_" + this.props.step.objectId}/>
    },
    getCancelButton(){
        return <NextStepCancelButton handleCancel={this.props.handleCancel} key={"next_step_action_cancel_" + this.props.step.objectId} />
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
