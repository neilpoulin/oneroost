import React, { PropTypes } from "react"

const BasicInfoDisplay = React.createClass({
    propTypes: {
        user: PropTypes.object.isRequired,
        doEdit: PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            onEdit: function(){
                console.error("Failed to implmenent onEdit for BasicInfoDisplay");
            }
        }
    },
    render () {
        var info =
        <div>
            <div className="title action">
                <h2>Basic Info</h2><a href='#' onClick={this.props.doEdit}>Edit</a>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Name</label>
                <div class="col-sm-10">
                    <p class="form-control-static">{this.props.user.get("firstName") + " " + this.props.user.get("lastName")}</p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Email</label>
                <div class="col-sm-10">
                    <p class="form-control-static">{this.props.user.get("email")}</p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Company</label>
                <div class="col-sm-10">
                    <p class="form-control-static">{this.props.user.get("company")}</p>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Job Title</label>
                <div class="col-sm-10">
                    <p class="form-control-static">{this.props.user.get("jobTitle")}</p>
                </div>
            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
