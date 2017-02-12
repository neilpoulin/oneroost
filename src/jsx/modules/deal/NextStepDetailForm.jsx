import React, { PropTypes } from "react"
import NextStepDetailView from "NextStepDetailView"
import NextStepDetailEdit from "NextStepDetailEdit"
import { browserHistory } from "react-router"
import { connect } from "react-redux"
import {updateStep} from "ducks/roost/nextSteps"

const NextStepDetailForm = React.createClass({
    propTypes: {
        step: PropTypes.object.isRequired,
        deal: PropTypes.object.isRequired
    },
    getInitialState(){
        return {
            isEdit: false
        }
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
        browserHistory.push("/roosts/" + this.props.deal.objectId );
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
    return {
        updateStep: (changes, message) => dispatch(updateStep(step, changes, message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NextStepDetailForm)
