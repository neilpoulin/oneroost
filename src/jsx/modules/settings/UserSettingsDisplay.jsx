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
        const {email, company, jobTitle, account, accountSeat} = user
        var info =
        <div className="BasicInfoDisplay">
            <div className="fieldContainer">                
                <FormGroupStatic
                    value={RoostUtil.getFullName(user)}
                    label="Name"

                    />

                <FormGroupStatic
                    value={email}
                    label="Email"

                    />

                <FormGroupStatic
                    value={company}
                    label="Company"

                    />
                <FormGroupStatic
                    value={jobTitle}
                    label="Job Title"

                    />
                <FormGroupStatic
                    value={`${account.accountName}`}
                    label="Account"

                    />
            </div>
            <div>
                <span className="btn btn-outline-primary editButton" onClick={this.props.doEdit}>Edit</span>
            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
