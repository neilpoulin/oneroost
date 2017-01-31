import React, {PropTypes} from "react"
import Parse from "parse";
import FormInputGroup from "FormInputGroup"
import {withRouter} from "react-router"
import SpinnerIcon from "./SpinnerIcon"
import FormUtil from "FormUtil"
import ReactGA from "react-ga"
import TermsOfServiceDisclaimer from "TermsOfServiceDisclaimer"
import {loginValidation, registerValidation} from "RegistrationValidations"
import {connect} from "react-redux"
import {userLoggedIn} from "ducks/user"

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
    },
    getInitialState: function(){
        var username;
        var isLoggedIn = false;
        var email = "";
        var user = Parse.User.current();
        if ( user )
        {
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
            success: function(user){
                const { location, router , afterLoginPath} = this;
                if (location && location.state && location.state.nextPathname && window.location.pathname != location.state.nextPathname) {
                    router.replace(location.state.nextPathname)
                } else {
                    router.replace(afterLoginPath)
                }
            }
        }
    },
    doLogin: function(){
        var component = this;
        this.showLoading();
        if ( this.state.isLogin )
        {
            Parse.User.logIn(this.state.email.toLowerCase(), this.state.password, {
                success: (saved) => {component.handleLoginSuccess(saved)},
                error: component.handleLoginError
            });
        }
        else {
            var user = new Parse.User();
            user.set("username", this.state.email);
            user.set("email", this.state.email);
            user.set("password", this.state.password);
            user.set("firstName", this.state.firstName);
            user.set("lastName", this.state.lastName);
            user.set("passwordChangeRequired", false);
            user.set("company", this.state.company);
            user.set("passwordChangeRequired", false);
            user.signUp( null, {
                success: (saved) => {component.handleRegisterSuccess(saved)},
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
    handleLoginError: function(user, error)
    {
        let message = ""
        switch( error.code )
        {
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
        console.error(error);
        this.hideLoading();
    },
    handleRegisterSuccess(user){
        ReactGA.event({
          category: "User",
          action: "Registration"
        });
        return this.handleLoginSuccess(user);
    },
    handleLoginSuccess: function(user){
        this.props.userLoggedIn(user);
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
        if ( e ){
            e.preventDefault();
        }
        let errors = FormUtil.getErrors(this.state, this.getValidation());
        if ( !FormUtil.hasErrors(errors) ){
            var component = this;
            this.showLoading();
            if ( this.state.isLogin )
            {
                Parse.User.logIn(this.state.email.toLowerCase(), this.state.password, {
                    success: (user) =>{
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
                user.set("passwordChangeRequired", false);
                user.signUp( null, {
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
        if ( self.state.email )
        {
            if ( !FormUtil.isValidEmail(self.state.email) )
            {
                let errors = self.state.errors;
                errors.alert = {message:"Please enter a valid email and try again.", level: "warning"}
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
        else
        {
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
            password} = this.state;

        if ( this.state.isLoggedIn )
        {
            return false;
        }

        var btnText = this.state.isLogin ? "Log In" : "Sign Up";

        let tabs = null;
        if ( this.props.showRegister ){
            tabs =
            <ul className="nav nav-tabs nav-justified" >
                <li role="presentation " className={"pointer " + ( this.state.isLogin ? "" : "active" )} >
                    <a onClick={this.setIsRegister}>Sign Up</a>
                </li>
                <li role="presentation" className={"pointer " + ( this.state.isLogin ? "active" : "" )} >
                    <a onClick={this.setIsLogin}>Login</a>
                </li>
            </ul>;
        }

        let alert = null;
        if ( errors.alert )
        {
            alert =
            <div className={`errorMessage alert alert-${this.state.errors.alert.level}`}>
                {this.state.errors.alert.message}
            </div>;
        }

        let companyInput = null;
        let firstNameInput = null;
        let lastNameInput = null;
        let forgotLink = null;
        let nameInput = null;
        if ( !this.state.isLogin ){
            if ( this.props.showCompany ){
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
                    onChange={val => this.setState({"firstName": val})}
                    />;
            lastNameInput = <FormInputGroup
                fieldName="lastName"
                value={lastName}
                label="Last Name"
                errors={errors}
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

        let terms = null;
        if (this.props.showTermsOfService){
            terms = <TermsOfServiceDisclaimer/>
        }

        let actionButton = null;
        if ( this.props.showButton ){
            actionButton =
            <div className="">
                <button className="btn btn-primary btn-block"
                    id="loginSubmitBtn"
                    type="submit">
                    {btnText} <SpinnerIcon visible={this.state.loading}/>
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
                    onChange={val => this.setState({"email": val})}
                    />
                {companyInput}
                <FormInputGroup
                    fieldName="password"
                    value={password}
                    label="Password"
                    errors={errors}
                    type={"password"}
                    onChange={val => this.setState({"password": val})}
                    />
                {actionButton}
                {forgotLink}
            </form>
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
        }
    }
}

const connectOpts = {
    withRef: true
}


export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(withRouter( LoginComponent, {withRef: true}));
