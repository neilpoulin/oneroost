import React from "react"
import PropTypes from "prop-types"
import Parse from "parse";
import FormInputGroup from "FormInputGroup"
import {withRouter} from "react-router"
import SpinnerIcon from "./SpinnerIcon"
import FormUtil from "FormUtil"
import ReactGA from "react-ga"
import TermsOfServiceDisclaimer from "TermsOfServiceDisclaimer"
import {loginValidation, registerValidation} from "RegistrationValidations"
import {connect} from "react-redux"
import {userLoggedIn,
    updateIntercomUser,
    linkUserWithProvider,
    linkUserWithProviderError
} from "ducks/user"
import * as log from "LoggingUtil"
import GoogleLogin from "react-google-login"
import LoginWithLinkedin from "form/LoginWithLinkedin"

const LoginComponent = React.createClass({
    propTypes: {
        success: PropTypes.func,
        company: PropTypes.string,
        showCompany: PropTypes.bool,
        showButton: PropTypes.bool,
        isLogin: PropTypes.bool,
        showRegister: PropTypes.bool,
        afterLoginPath: PropTypes.string,
        showTermsOfService: PropTypes.bool,
        showTabs: PropTypes.bool,
    },
    getInitialState: function(){
        var username;
        var isLoggedIn = false;
        var email = "";
        var user = Parse.User.current();
        if (user) {
            username = user.username
            isLoggedIn = true;
            email = user.email
        }
        return {
            isLoggedIn: isLoggedIn,
            username: username,
            firstName: "",
            lastName: "",
            password: "",
            email: email,
            isLogin: window.location.pathname.indexOf("login") != -1,
            error: "",
            isTyping: false,
            emailValidation: "",
            passwordValidation: "",
            company: this.props.company,
            loading: false,
            errors: {},
        };
    },
    getDefaultProps(){
        return {
            company: "",
            showButton: true,
            isLogin: true,
            showRegister: true,
            showCompany: true,
            afterLoginPath: "/roosts",
            showTermsOfService: true,
            showTabs: false,
            success: function(user){
                const { location, router, afterLoginPath} = this;
                if (location && location.query.forward){
                    router.replace(location.query.forward)
                }
                else if (location && location.state && location.state.nextPathname && window.location.pathname != location.state.nextPathname) {
                    router.replace(location.state.nextPathname)
                }
                else {
                    router.replace(afterLoginPath)
                }
            }
        }
    },
    doLogin: function(){
        var component = this;
        this.showLoading();
        if (this.state.isLogin) {
            Parse.User.logIn(this.state.email.toLowerCase(), this.state.password, {
                success: (saved) => {
                    component.handleLoginSuccess(saved)
                },
                error: component.handleLoginError
            });
        }
        else {
            var user = new Parse.User();
            user.set("username", this.state.email.toLowerCase());
            user.set("email", this.state.email.toLowerCase());
            user.set("password", this.state.password);
            user.set("firstName", this.state.firstName);
            user.set("lastName", this.state.lastName);
            user.set("passwordChangeRequired", false);
            user.set("company", this.state.company);
            user.set("passwordChangeRequired", false);
            user.signUp(null, {
                success: (saved) => {
                    component.handleRegisterSuccess(saved)
                },
                error: component.handleLoginError
            });
        }
    },
    showLoading(){
        this.setState({loading: true});
    },
    hideLoading(){
        this.setState({loading: false});
    },
    handleLoginError: function(user, error) {
        let message = ""
        switch(error.code) {
            case 101: //invalid login params
                message = "Invalid login credentials, please try again"
                break;
            case 202: //username taken
                message = "That username is not available, please use another"
                break;
            default:
                message = "Something went wrong logging in. Please try again."
                break;
        }
        let alert = {alert: {message: message, level: "danger"}};
        this.setState({"errors": alert});
        log.error(error);
        this.hideLoading();
    },
    handleRegisterSuccess(user){
        ReactGA.event({
            category: "User",
            action: "Registration"
        });
        updateIntercomUser(user)
        return this.handleLoginSuccess(user);
    },
    handleLoginSuccess: function(user){
        this.props.userLoggedIn(user);
        updateIntercomUser(user)
        this.props.success();
    },
    setIsRegister: function(e){
        this.setState({isLogin: false,
            emailValidation: null,
            passwordValidation: null,
            error: null});
    },
    setIsLogin: function(e){
        this.setState({
            isLogin: true,
            emailValidation: null,
            passwordValidation: null,
            error: null
        });
    },
    getValidation(){
        if (this.state.isLogin){
            return loginValidation;
        }
        return registerValidation;
    },
    doSubmit(e){
        if (e){
            e.preventDefault();
        }
        let errors = FormUtil.getErrors(this.state, this.getValidation());
        if (!FormUtil.hasErrors(errors)){
            var component = this;
            this.showLoading();
            if (this.state.isLogin) {
                Parse.User.logIn(this.state.email.toLowerCase(), this.state.password, {
                    success: (user) => {
                        this.setState({errors: {}});
                        component.handleLoginSuccess(user);
                    },
                    error: component.handleLoginError
                });
                return true;
            }
            else {
                var user = new Parse.User();
                user.set("username", this.state.email.toLowerCase());
                user.set("email", this.state.email.toLowerCase());
                user.set("password", this.state.password);
                user.set("firstName", this.state.firstName);
                user.set("lastName", this.state.lastName);
                user.set("company", this.state.company)
                user.set("passwordChangeRequired", false);
                user.signUp(null, {
                    success: (savedUser) => {
                        this.setState({errors: {}});
                        component.handleLoginSuccess(savedUser)
                    },
                    error: component.handleLoginError
                });
            }
            return true;
        }
        this.setState({errors: errors});
    },
    resetPassword: function(){
        var self = this;
        if (self.state.email) {
            if (!FormUtil.isValidEmail(self.state.email)) {
                let errors = self.state.errors;
                errors.alert = {message: "Please enter a valid email and try again.", level: "warning"}
                self.setState({errors: errors});
                return
            }

            Parse.User.requestPasswordReset(self.state.email, {
                success: function() {
                    let errors = self.state.errors;
                    errors.alert = {message: "An email has been sent to you with instructions for resetting your password.", level: "success"};
                    self.setState({error: errors});
                },
                error: function(error) {
                    let errors = self.state.errors;
                    errors.alert = {message: "Something went wrong when sending reset instructions. Please try again.", level: "danger"};
                    self.setState({error: errors});
                }
            });
        }
        else {
            let errors = self.state.errors;
            errors.alert = errors.alert = {message: "Please enter your email and try again.", level: "warning"};
            self.setState({error: errors});
        }
    },
    render: function(){
        let {errors,
            company,
            email,
            firstName,
            lastName,
            password,
            isLogin,
            isLoggedIn,
        } = this.state;

        const {
            showTabs,
            showRegister,
            showCompany,
            showTermsOfService,
            googleSuccess,
            googleError,
            linkedinSuccess,
            linkedinError,
        } = this.props;

        if (isLoggedIn) {
            return false;
        }

        var btnText = isLogin ? "Log In" : "Sign Up";

        let tabs =
            <ul className="nav nav-tabs nav-justified" display-if={showTabs && showRegister} >
                <li role="presentation " className={"pointer " + (isLogin ? "" : "active")} >
                    <a onClick={this.setIsRegister}>Sign Up</a>
                </li>
                <li role="presentation" className={"pointer " + (isLogin ? "active" : "")} >
                    <a onClick={this.setIsLogin}>Login</a>
                </li>
            </ul>;

        let alert = null;
        if (errors.alert) {
            alert =
            <div className={`errorMessage alert alert-${errors.alert.level}`}>
                {errors.alert.message}
            </div>;
        }

        let companyInput = null;
        let firstNameInput = null;
        let lastNameInput = null;
        let forgotLink = null;
        let nameInput = null;
        if (!isLogin){
            if (showCompany){
                companyInput =
                <FormInputGroup
                    fieldName="company"
                    value={company}
                    label="Company"
                    errors={errors}
                    maxLength={40}
                    onChange={val => this.setState({"company": val})}
                    />
            }

            firstNameInput = <FormInputGroup
                    fieldName="firstName"
                    value={firstName}
                    label="First Name"
                    errors={errors}
                    name="fname"
                    autoFocus={!isLogin}
                    onChange={val => this.setState({"firstName": val})}
                    autocompleteType={"given-name"}
                    />;
            lastNameInput = <FormInputGroup
                fieldName="lastName"
                value={lastName}
                label="Last Name"
                errors={errors}
                autocompleteType={"family-name"}
                name="lname"
                onChange={val => this.setState({"lastName": val})}
                />

            nameInput =
            <div className="form-inline-half">
                {firstNameInput}
                {lastNameInput}
            </div>
        }
        else{
            forgotLink =
            <div className={"forgotPassword"}>
                {"Forgot your password?"} <span className="link" onClick={this.resetPassword}>Click here</span> to reset it.
            </div>
        }

        let terms = <TermsOfServiceDisclaimer display-if={showTermsOfService}/>;

        let actionButton = null;
        if (this.props.showButton){
            actionButton =
            <div className="">
                <button className="btn btn-primary btn-block"
                    id="loginSubmitBtn"
                    type="submit">
                    {btnText} <SpinnerIcon display-if={this.state.loading}/>
                </button>
            </div>
        }

        var result =
        <div className="LoginComponent">
            {tabs}
            <form className="" onSubmit={this.doSubmit}>
                {alert}
                {nameInput}
                <FormInputGroup
                    fieldName="email"
                    value={email}
                    label="Email"
                    errors={errors}
                    type={"email"}
                    autocompleteType={"email"}
                    name={"email"}
                    autoFocus={isLogin}
                    placeholder="name@company.com"
                    onChange={(val="") => this.setState({"email": val.toLowerCase()})}
                    />
                {companyInput}
                <FormInputGroup
                    fieldName="password"
                    value={password}
                    label="Password"
                    errors={errors}
                    type={"password"}
                    name="password"
                    onChange={val => this.setState({"password": val})}
                    />
                {actionButton}
                {forgotLink}
            </form>
            <div className="oauthLogins">
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
                <LoginWithLinkedin connectSuccess={linkedinSuccess}/>
            </div>
            {terms}
        </div>

        return result;
    }
})

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        userLoggedIn: (user) => {
            dispatch(userLoggedIn(user))
        },
        googleSuccess: (authData) => {
            const {familyName, givenName, email} = authData.profileObj || {}
            dispatch(linkUserWithProvider("google", {
                access_token: authData.accessToken,
                id: authData.googleId,
                firstName: givenName,
                lastName: familyName,
                email,
                username: email,
            }))
        },
        googleError: (error) => {
            dispatch(linkUserWithProviderError("google", error))
        },
        linkedinSuccess: (authData) => {
            dispatch(linkUserWithProvider("linkedin", authData))
        },
        linkedinError: (error) => {
            dispatch(linkUserWithProviderError("linkedin"), error)
        },
    }
}

const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(withRouter(LoginComponent, {withRef: true}));
