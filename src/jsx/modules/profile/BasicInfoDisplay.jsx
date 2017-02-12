import React, { PropTypes } from "react"
import FormGroupStatic from "FormGroupStatic"
import * as RoostUtil from "RoostUtil"
import * as log from "LoggingUtil"

const BasicInfoDisplay = React.createClass({
    propTypes: {
        user: PropTypes.object.isRequired,
        doEdit: PropTypes.func.isRequired
    },
    getDefaultProps(){
        return {
            onEdit: function(){
                log.error("Failed to implmenent onEdit for BasicInfoDisplay");
            }
        }
    },
    render () {
        const {user} = this.props
        const {email, company, jobTitle} = user
        var info =
        <div>
            <div className="title action">
                <h2>Basic Info</h2><span className="link" onClick={this.props.doEdit}>Edit</span>
            </div>
            <div className="row">

                <FormGroupStatic
                    value={RoostUtil.getFullName(user)}
                    label="Name"
                    horizontal={true}
                    />


                <FormGroupStatic
                    value={email}
                    label="Email"
                    horizontal={true}
                    />

                <FormGroupStatic
                    value={company}
                    label="Company"
                    horizontal={true}
                    />
                <FormGroupStatic
                    value={jobTitle}
                    label="Job Title"
                    horizontal={true}
                    />

            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
