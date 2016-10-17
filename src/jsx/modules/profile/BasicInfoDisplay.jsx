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
            <div>
                <b>email:</b> {this.props.user.get("email")}
            </div>
            <div>
                <b>First Name:</b> {this.props.user.get("firstName")}
            </div>
            <div>
                <b>Last Name:</b> {this.props.user.get("lastName")}
            </div>
            <div>
                <button className="btn btn-primary" onClick={this.props.doEdit}>Edit</button>
            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
