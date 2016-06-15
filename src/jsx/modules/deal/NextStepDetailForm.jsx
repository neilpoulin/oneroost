import React, { PropTypes } from "react"
import Parse from "parse"
import ParseReact from "parse-react"
import NextStepDetailView from "./NextStepDetailView"
import NextStepDetailEdit from "./NextStepDetailEdit"
import { browserHistory } from "react-router"

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
        var message = user.get("firstName") + " " + user.get("lastName") + " deleted Next Step: " + step.title;
        var comment = {
            deal: self.props.deal,
            message: message,
            author: null,
            username: "OneRoost Bot",
        };
        ParseReact.Mutation.Create("DealComment", comment).dispatch();
    },
    render () {
        var form = null;
        if ( this.state.isEdit ){
            form = <NextStepDetailEdit step={this.props.step}
                deal={this.props.deal}
                afterSave={this.afterSave}
                afterDelete={this.afterDelete}
                handleCancel={this.handleCancel}
                />
        }
        else {
            form = <NextStepDetailView step={this.props.step} handleEdit={this.handleEdit}/>
        }
        return form;
    }
})

export default NextStepDetailForm
