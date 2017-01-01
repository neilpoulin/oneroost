import React, {PropTypes} from "react"
import Parse from "parse";
import FormInputGroup from "FormInputGroup"
import {withRouter} from "react-router"
import SpinnerIcon from "./SpinnerIcon"
import FormUtil from "FormUtil"
import ReactGA from "react-ga"
import {loginValidation, registerValidation} from "RegistrationValidations"

const LoginComponent = React.createClass({
    propTypes: {
        success: PropTypes.func,
        company: PropTypes.string,
        showCompany: PropTypes.bool,
        showButton: PropTypes.bool,
        isLogin: PropTypes.bool,
        showRegister: PropTypes.bool,
        afterLoginPath: PropTypes.string,
    },
    getInitialState: function(){
        var username;
        var isLoggedIn = false;
        var email = "";
        var user = Parse.User.current();
        if ( user )
        {
            username = user.get("username");
            isLoggedIn = true;
            email = user.get("email");
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
            afterLoginPath: "/roosts",
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
                success: component.handleLoginSuccess,
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
                success: component.handleRegisterSuccess,
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
    doSubmit(){
        let errors = FormUtil.getErrors(this.state, this.getValidation());
        if ( !FormUtil.hasErrors(errors) ){
            var component = this;
            this.showLoading();
            if ( this.state.isLogin )
            {
                Parse.User.logIn(this.state.email.toLowerCase(), this.state.password, {
                    success: () =>{
                        this.setState({errors: {}});
                        component.handleLoginSuccess();
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
                    success: () => {
                        this.setState({errors: {}});
                        component.handleLoginSuccess()
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
        }

        let actionButton = null;
        if ( this.props.showButton ){
            actionButton =
            <div className="">
                <span className="btn btn-primary btn-block" id="loginSubmitBtn" onClick={this.doSubmit}>{btnText} <SpinnerIcon visible={this.state.loading}/></span>
            </div>
        }

        var result =
        <div className="LoginComponent">
            {tabs}
            <form className="">
                {alert}
                <FormInputGroup
                    fieldName="email"
                    value={email}
                    label="Email"
                    errors={errors}
                    onChange={val => this.setState({"email": val})}
                    />
                {firstNameInput}
                {lastNameInput}
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
                <div className={"forgotPassword " + (this.state.isLogin ? "" : "hidden")}>
                    {"Forgot your password?"} <a href="#" onClick={this.resetPassword}>Click here</a> to reset it.
                </div>
            </form>
        </div>

        return result;
    }
})

export default withRouter( LoginComponent, {withRef: true} );
