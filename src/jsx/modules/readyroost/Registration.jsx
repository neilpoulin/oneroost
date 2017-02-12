import React, { PropTypes } from "react"
import LoginComponent from "LoginComponent"
import ReactGA from "react-ga"
import TermsOfServiceDisclaimer from "TermsOfServiceDisclaimer"
import * as log from "LoggingUtil"

const Registration = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        saveValues: PropTypes.func.isRequired,
        company: PropTypes.string.isRequired,
        nextText: PropTypes.string,
        previousText: PropTypes.string
    },
    getDefaultProps(){
        return {
            nextText: "Continue",
            previousText: "Previous Step"
        }
    },
    getInitialState(){
        return {
            currentUser: this.props.currentUser,
            canSubmit: false,
            error: null
        }
    },
    loginSuccess(){
        log.info("login success");

        ReactGA.event({
          category: "ReadyRoost",
          action: "Log in"
        });
        // this.props.saveValues({currentUser: this.props.currentUser});
        this.props.nextStep();
    },
    doLogin(e){
        this.refs.loginComponent.getWrappedInstance().getWrappedInstance().doSubmit()
    },
    render () {
        let loginComponent =
        <LoginComponent
            success={this.loginSuccess}
            showCompany={false}
            company={this.props.company}
            showButton={false}
            ref="loginComponent"
            showTermsOfService={false} />
        let continueButton = <button className="btn btn-primary" onClick={this.doLogin}>{this.props.nextText}</button>

        if ( this.props.currentUser ){
            loginComponent = <div className="lead">You've sussessfully logged in.</div>
            continueButton = <button className="btn btn-primary" onClick={this.props.nextStep}>{this.props.nextText}</button>
        }

        let page =
        <div>
            <div>
                {loginComponent}
            </div>
            <div className="actions" >
                <button className="btn btn-outline-secondary" onClick={this.props.previousStep}>{this.props.previousText}</button>
                {continueButton}
            </div>
            <TermsOfServiceDisclaimer/>
        </div>
        return page
    }
})

export default Registration
