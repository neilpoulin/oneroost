import React, { PropTypes } from "react"
import FormGroupStatic from "FormGroupStatic"
import * as RoostUtil from "RoostUtil"
import * as log from "LoggingUtil"
import GoogleLogin from "react-google-login"
import LoginWithLinkedin from "form/LoginWithLinkedin"

const BasicInfoDisplay = React.createClass({
    propTypes: {
        user: PropTypes.object.isRequired,
        doEdit: PropTypes.func.isRequired,
        googleSuccess: PropTypes.func,
        googleError: PropTypes.func,
        linkedinSuccess: PropTypes.func,
        linkedinError: PropTypes.func,
        connectedProviders: PropTypes.arrayOf("string")
    },
    getDefaultProps(){
        return {
            onEdit: function(){
                log.error("Failed to implmenent onEdit for BasicInfoDisplay");
            },
            connectedProviders: [],
        }
    },
    render () {
        const {
            user,
            googleSuccess,
            googleError,
            connectedProviders,
            linkedinSuccess,
            linkedinError,
        } = this.props
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
            <div className="oauthLogins">
                <div>
                    Connect to 3 Party Applications
                </div>
                <div display-if={connectedProviders.indexOf("google") === -1}>
                    <GoogleLogin
                            clientId='298915058255-27b27sbb83fpe105kj12ccv0hc7380es.apps.googleusercontent.com'
                            onSuccess={googleSuccess}
                            onFailure={googleError}
                            onRequest={() => console.log("google loading")}
                            offline={false}
                            approvalPrompt="force"
                            responseType="id_token"
                            isSignedIn={true}
                            className="googleLogin"
                            style={false}
                            tag="span"
                            buttonText={null}
                        />
                </div>
                <div display-if={connectedProviders.indexOf("linkedin") === -1}>
                    <LoginWithLinkedin connectSuccess={linkedinSuccess}/>
                </div>
                <div className="connectedProviders" display-if={connectedProviders && connectedProviders.length > 0}>
                    <ul className="list-unstyled list">
                    {connectedProviders.map(providerName =>
                            <li>
                                <span><i className="fa fa-check"></i> {providerName}</span>
                            </li>
                    )}
                </ul>
                </div>
            </div>
            <div>
                <span className="btn btn-outline-primary editButton" onClick={this.props.doEdit}>Edit</span>
            </div>
        </div>

        return info
    }
})

export default BasicInfoDisplay
