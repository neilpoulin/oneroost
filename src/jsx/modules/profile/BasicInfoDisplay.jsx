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
            <div className="row">
                <div className="form-group">
                    <label className="col-sm-2 control-label">Name</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">{this.props.user.get("firstName") + " " + this.props.user.get("lastName")}</p>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Email</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">{this.props.user.get("email")}</p>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Company</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">{this.props.user.get("company")}</p>
                    </div>
                </div>
                <div className="form-group">
                    <label className="col-sm-2 control-label">Job Title</label>
                    <div className="col-sm-10">
                        <p className="form-control-static">{this.props.user.get("jobTitle")}</p>
                    </div>
                </div>
            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
