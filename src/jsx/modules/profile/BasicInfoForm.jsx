import React, { PropTypes } from "react"
import {linkState} from "LinkState"

const BasicInfoForm = React.createClass({
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
            email: user.get("email") || "",
            firstName: user.get("firstName") || "",
            lastName: user.get("lastName") || "",
            jobTitle: user.get("jobTitle") || "",
            company: user.get("company") || ""
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
        var form =
        <div className="">
            <h2>Edit your info</h2>
            <div className="form-inline-equal">
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text"
                        className="form-control"
                        value={this.state.firstName}
                        onChange={linkState(this,"firstName")}/>
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text"
                        className="form-control"
                        value={this.state.lastName}
                        onChange={linkState(this,"lastName")}/>
                </div>
            </div>

            <div className="form-group">
                <label>Email</label>
                <input type="text"
                    className="form-control"
                    value={this.state.email}
                    onChange={linkState(this,"email")}/>
            </div>

            <div className="form-group">
                <label>Company</label>
                <input type="text"
                    className="form-control"
                    value={this.state.company}
                    onChange={linkState(this,"company")}/>
            </div>
            <div className="form-group">
                <label>Job Title</label>
                <input type="text"
                    className="form-control"
                    value={this.state.jobTitle}
                    onChange={linkState(this,"jobTitle")}/>
            </div>
            <div className="actions">
                <button className="btn btn-link pull-left" onClick={this.doCancel}>Cancel</button>
                <button className="btn btn-primary pull-right" onClick={this.doSave}>Save</button>
            </div>
        </div>
        return form
    }
})

export default BasicInfoForm
