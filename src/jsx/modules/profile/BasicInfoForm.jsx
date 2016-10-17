import React, { PropTypes } from "react"
import LinkedStateMixin from "react-addons-linked-state-mixin";

const BasicInfoForm = React.createClass({
    mixins: [LinkedStateMixin],
    propTypes: {
        user: PropTypes.object.isRequired,
        doCancel: PropTypes.func.isRequired,
        doSave: PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            onCancel: function(){
                console.error("failed to impelement onCancel for BasicInfoForm");
            },
            onSave: function(){
                console.error("Failed to implement onSave for BasicInfoForm");
            }
        }
    },
    getInitialState(){
        var user = this.props.user;
        return {
            email: user.get("email"),
            firstName: user.get("firstName"),
            lastName: user.get("lastName"),
            jobTitle: user.get("jobTitle"),
            company: user.get("company")
        }
    },
    doSave(){
        console.log("saving user info");
        this.props.user.set("email", this.state.email)
        this.props.user.set("firstName", this.state.firstName)
        this.props.user.set("lastName", this.state.lastName)
        this.props.user.set("company", this.state.company)
        this.props.user.set("jobTitle", this.state.jobTitle)
        this.props.user.save()
        this.props.doSave()
    },
    doCancel(){
        console.log("canceling changes to user info");
        this.setState(this.getInitialState());
        this.props.doCancel();
    },
    render () {
        var form = <div>
            <h2>Edit your info</h2>
            <div className="form-group">
                Email:
                <input type="text" className="form-control" valueLink={this.linkState("email")}/>
            </div>
            <div className="form-group">
                First Name:
                <input type="text" className="form-control" valueLink={this.linkState("firstName")}/>
            </div>
            <div className="formt-group">
                Last Name:
                <input type="text" className="form-control" valueLink={this.linkState("lastName")}/>
            </div>
            <div className="formt-group">
                Company:
                <input type="text" className="form-control" valueLink={this.linkState("company")}/>
            </div>
            <div className="formt-group">
                Job Title:
                <input type="text" className="form-control" valueLink={this.linkState("jobTitle")}/>
            </div>
            <div>
                <button className="btn btn-link pull-left" onClick={this.doCancel}>Cancel</button> <button className="btn btn-primary pull-right" onClick={this.doSave}>Save</button>
            </div>
        </div>
        return form
    }
})

export default BasicInfoForm
