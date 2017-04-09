import React, { PropTypes } from "react"
import {withRouter} from "react-router"
import RoostNav from "RoostNav"

const EmailValidationSuccessPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            username: PropTypes.string
        }),
    },
    getDefaultProps(){

    },
    render () {
        const {params} = this.props;
        return (
            <div className="EmailValidationSuccessPage">
                <RoostNav/>
                <div className="container">
                    <h2>Success!</h2>
                    <p className="lead">
                        Your email has been successfully verified.
                    </p>
                </div>
            </div>
        )
    }
})

export default withRouter(EmailValidationSuccessPage)
