import React, {PropTypes} from "react"
import Parse from "parse";
import FormInputGroup from "FormInputGroup"
import SpinnerIcon from "./SpinnerIcon"
import FormUtil from "FormUtil"
import ReactGA from "react-ga"
import {loginValidation, registerValidation} from "RegistrationValidations"

export default React.createClass({
    propTypes: {
        logoutSuccess: PropTypes.func.isRequired,
        success: PropTypes.func.isRequired,
        company: PropTypes.string,
        showCompany: PropTypes.bool,
        showButton: PropTypes.bool,
        isLogin: PropTypes.bool,
        showRegister: PropTypes.bool,
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
        }
    },
    doLogin: function(e){
        e.preventDefault();
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
    doLogout: function(e){
        e.preventDefault();
        var component = this;
        this.showLoading();
        Parse.User.logOut()
        .done(component.handleLogoutSuccess)
        .fail(component.handleLogoutError);
    },
    showLoading(){
        this.setState({loading: true});
    },
    hideLoading(){
        this.setState({loading: false});
    },
    handleLoginError: function(user, error)
    {
        switch( error.code )
        {
            case 101: //invalid login params
            break;
            case 202: //username taken
            break;
            default:
            break;
        }
        this.setState({"error": error});
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
        if ( this.props.success )
        {
            return this.props.success();
        }
    },
    handleLogoutSuccess: function()
    {
        this.setState({
            isLoggedIn: false,
            username: null,
            password: null,
            email: null
        });

        if ( this.props.logoutSuccess )
        {
            this.props.logoutSuccess();
        }
        return this.render();
    },
    handleLogoutError: function( user, error ){
        console.error( "failed to log out" );
        console.error( error );
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
            if ( !self.isValidEmail() )
            {
                self.setState({error: {message:"Please enter your email and try again."}});
                return
            }

            Parse.User.requestPasswordReset(self.state.email, {
                success: function() {
                    // Password reset request was sent successfully
                    alert("reset request successful");
                    let errors = this.state.errors;
                    errors.alert = null;
                    self.setState({error: errors});
                },
                error: function(error) {
                    // Show the error message somewhere
                    let errors = this.state.errors;
                    errors.alert = "Please enter your email and try again."
                    self.setState({error: errors});
                }
            });
        }
        else
        {
            //todo: tell the use to enter an email
            let errors = this.state.errors;
            errors.alert = "Please enter your email and try again."
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

        var tabs =
        <ul className="nav nav-tabs nav-justified" >
            <li role="presentation " className={"pointer " + ( this.state.isLogin ? "" : "active" )} >
                <a onClick={this.setIsRegister}>Sign Up</a>
            </li>
            <li role="presentation" className={"pointer " + ( this.state.isLogin ? "active" : "" )} >
                <a onClick={this.setIsLogin}>Login</a>
            </li>
        </ul>;

        let alert = null;
        if ( errors.alert )
        {
            alert =
            <div className="errorMessage alert alert-danger">
                {this.state.errors.alert}
            </div>;
        }

        let companyInput = null;
        let firstNameInput = null;
        let lastNameInput = null;
        if ( !this.state.isLogin ){
            companyInput =
            <FormInputGroup
                fieldName="company"
                value={company}
                label="Company"
                errors={errors}
                maxLength={40}
                onChange={val => this.setState({"company": val})}
                />

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
            <div className="">
                {tabs}
            </div>
            <form className="container-fluid">
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
});
