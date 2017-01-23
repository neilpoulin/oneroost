import React, { PropTypes } from "react"
import Parse from "parse"
import DealComment from "models/DealComment"
import RoostUtil from "RoostUtil"
import NextStepDetailView from "NextStepDetailView"
import NextStepDetailEdit from "NextStepDetailEdit"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import {updateStep} from "ducks/nextSteps"
import {Pointer as DealPointer} from "models/Deal"
import {Pointer as UserPointer} from "models/User"
import {fromJS} from "immutable"

const NextStepDetailForm = React.createClass({
    getInitialState(){
        return {
            isEdit: false
        }
    },
    propTypes: {
        step: PropTypes.object.isRequired,
        deal: PropTypes.object.isRequired
    },
    handleEdit: function(){
        this.setState({isEdit: true});
    },
    handleCancel: function(){
        this.setState({isEdit: false});
    },
    afterSave: function(){
        this.setState({isEdit: false});
    },
    afterDelete: function(){
        this.addStepDeletedComment();
        browserHistory.push("/roosts/" + this.props.deal.objectId );
    },
    addStepDeletedComment: function( ){
        var self = this;
        var user = Parse.User.current();
        var step = this.props.step;
        var message = RoostUtil.getFullName(user) + " deleted Next Step: " + step.title
        let comment = new DealComment();
        comment.set({
            deal: self.props.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        });
        comment.save().catch(error => console.error);
    },
    render () {
        var form = null;
        if ( this.state.isEdit ){
            form = <NextStepDetailEdit step={this.props.step}
                deal={this.props.deal}
                afterSave={this.afterSave}
                afterDelete={this.afterDelete}
                handleCancel={this.handleCancel}
                updateStep={this.props.updateStep}
                />
        }
        else {
            form = <NextStepDetailView step={this.props.step} handleEdit={this.handleEdit} updateStep={this.props.updateStep}/>
        }
        return form;
    }
})

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    let {step} = ownProps
    let stepCopy = fromJS(step).toJS()
    stepCopy.deal = DealPointer(stepCopy.deal)
    stepCopy.createdBy = UserPointer(stepCopy.createdBy)
    stepCopy.modifiedBy = UserPointer(stepCopy.modifiedBy)
    stepCopy.assignedUser = stepCopy.assignedUser ? UserPointer(stepCopy.assignedUser) : null
    return {
        updateStep: (changes, message) => dispatch(updateStep(stepCopy, changes, message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NextStepDetailForm)
