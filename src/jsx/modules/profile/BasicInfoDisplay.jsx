import React, { PropTypes } from "react"
import FormGroupStatic from "FormGroupStatic"
import RoostUtil from "RoostUtil"

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
        const {user} = this.props
        var info =
        <div>
            <div className="title action">
                <h2>Basic Info</h2><a href='#' onClick={this.props.doEdit}>Edit</a>
            </div>
            <div className="row">

                <FormGroupStatic
                    value={RoostUtil.getFullName(user)}
                    label="Name"
                    horizontal={true}
                    />


                <FormGroupStatic
                    value={user.get("email")}
                    label="Email"
                    horizontal={true}
                    />

                <FormGroupStatic
                    value={user.get("company")}
                    label="Company"
                    horizontal={true}
                    />
                <FormGroupStatic
                    value={user.get("jobTitle")}
                    label="Job Title"
                    horizontal={true}
                    />

            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
