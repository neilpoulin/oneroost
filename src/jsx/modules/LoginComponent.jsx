/*global OneRoost*/
/*global window*/
/*global console*/
/*global alert*/
/*global clearTimeout*/
/*global setTimeout*/
import React, {PropTypes} from "react"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;

import SpinnerIcon from "./SpinnerIcon"
import RoostUtil from "./util/RoostUtil"
import ReactGA from "react-ga"
import {linkState} from "./util/LinkState"

export default React.createClass({
    propTypes: {
        logoutSuccess: PropTypes.func.isRequired,
        success: PropTypes.func.isRequired,
        company: PropTypes.string,
        showCompany: PropTypes.bool,
        showButton: PropTypes.bool
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
        };
    },
    getDefaultProps(){
        return {
            showCompany: true,
            company: "",
            showButton: true
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
        if ( this.refs.spinner ){
            this.refs.spinner.doShow();
        }
    },
    hideLoading(){
        if ( this.refs.spinner ){
            this.refs.spinner.doHide();
        }
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
                    self.setState({error: null});
                },
                error: function(error) {
                    // Show the error message somewhere
                    self.setState({error: {message:"Please enter your email and try again."}});
                }
            });
        }
        else
        {
            //todo: tell the use to enter an email
            self.setState({error: {message:"Please enter your email and try again."}});
        }
    },
    emailKeyUp: function(){
        var self = this;
        if ( this.emailTypingTimeout != null )
        {
            clearTimeout( self.emailTypingTimeout );
        }
        if ( self.state.emailValidation != null && self.isValidEmail() )
        {
            self.doEmailValidation();
        }
        else
        {
            self.emailTypingTimeout = setTimeout( function(){
                self.doEmailValidation();
            } , 500 );
        }
    },
    doEmailValidation: function()
    {
        var email = this.state.email;
        if ( email && email.length > 2 && !this.isValidEmail() )
        {
            this.setState({emailValidation: {
                message: "Please enter a valid email",
                level: "error"
            }});
        }
        else
        {
            this.setState({emailValidation: null});
        }
    },
    isValidEmail: function(){
        return RoostUtil.isValidEmail(this.state.email);
    },
    emailTypingTimeout: null,
    passwordKeyUp: function(){
        var self = this;
        if ( self.passwordTypingTimeout != null )
        {
            clearTimeout( self.passwordTypingTimeout );
        }
        if ( self.state.passwordValidation != null && self.isValidPassword() )
        {
            self.doPasswordValidation();
        }
        else {
            this.passwordTypingTimeout = setTimeout( function(){
                self.doPasswordValidation();
            }, 500 );
        }
    },
    doPasswordValidation: function(){
        var password = this.state.password;
        if ( password && password.length > 1 && !this.isValidPassword() )
        {
            this.setState({passwordValidation: {
                message: "Your password must be at least 4 characters long",
                level: "error"
            }});
        }
        else
        {
            this.setState({passwordValidation: null});
        }
    },
    passwordTypingTimeout: null,
    isValidPassword: function(){
        var password = this.state.password || "";
        return password.length > 3;
    },
    render: function(){
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

        var error = <div></div>
        if ( this.state.error )
        {
            error =
            <div className="errorMessage alert alert-danger">
                {this.state.error.message}
            </div>;
        }

        var emailHelpBlock = "";
        var emailValidationClass = "";

        var passwordHelpBlock = "";
        var passwordValidationClass = "";


        if ( this.state.emailValidation )
        {
            emailHelpBlock = this.state.emailValidation.message;
            emailValidationClass = "has-" + this.state.emailValidation.level;
        }

        if ( this.state.passwordValidation )
        {
            passwordHelpBlock = this.state.passwordValidation.message;
            passwordValidationClass = "has-" + this.state.passwordValidation.level;
        }
        let companyInput = null
        if ( this.props.showCompany ){
            companyInput =
            <div className={"form-group " + (!this.state.isLogin ? "" : "hidden")}>
                <label htmlFor="loginLastNameInput" className="control-label">Company</label>
                <input type="text"
                    id="loginLastNameInput"
                    className="form-control"
                    value={this.state.company}
                    onChange={linkState(this,"company")}
                    placeholder=""
                    aria-describedby="companyHelpBlock"
                    maxLength={40}/>
            </div>
        }

        let actionButton = null;
        if ( this.props.showButton ){
            actionButton =
            <div className="form-group">
                <br/>
                <button className="btn btn-primary btn-block" id="loginSubmitBtn" onClick={this.doLogin}>{btnText} <SpinnerIcon ref="spinner"></SpinnerIcon></button>
            </div>
        }

        var result =
        <div className="LoginComponent">
            <div className="">
                {tabs}
            </div>
            <form className="container-fluid">
                {error}
                <div className={"form-group " + (!this.state.isLogin ? "" : "hidden")}>
                    <label htmlFor="loginLastNameInput" className="control-label">First Name</label>
                    <input type="text"
                        id="loginLastNameInput"
                        className="form-control"
                        value={this.state.firstName}
                        onChange={linkState(this,"firstName")}
                        placeholder=""
                        aria-describedby="firstNameHelpBlock"/>
                </div>
                <div className={"form-group " + (!this.state.isLogin ? "" : "hidden")}>
                    <label htmlFor="loginLastNameInput" className="control-label">Last Name</label>
                    <input type="text"
                        id="loginLastNameInput"
                        className="form-control"
                        value={this.state.lastName}
                        onChange={linkState(this,"lastName")}
                        placeholder=""
                        aria-describedby="lastNameHelpBlock"/>
                </div>

                <div className={"form-group " + emailValidationClass}>
                    <label htmlFor="loginUsernameInput" className="control-label">Email</label>
                    <input type="email"
                        id="loginEmailInput"
                        className="form-control"
                        value={this.state.email}
                        onChange={linkState(this,"email")}
                        onKeyUp={this.emailKeyUp}
                        placeholder=""
                        aria-describedby="emailHelpBlock"/>
                    <span className="help-block" id="emailHelpBlock">{emailHelpBlock}</span>
                </div>
                {companyInput}
                <div className={"form-group " + passwordValidationClass}>
                    <label htmlFor="loginPasswordInput" className="control-label">Password</label>
                    <input type="password"
                        id="loginPasswordInput"
                        className="form-control"
                        value={this.state.password}
                        onChange={linkState(this,"password")}
                        onKeyUp={this.passwordKeyUp}
                        aria-describedby="passwordHelpBlock"/>
                    <span className="help-block" id="passwordHelpBlock">{passwordHelpBlock}</span>
                </div>
                {actionButton}
                <div className={"forgotPassword " + (this.state.isLogin ? "" : "hidden")}>
                    {"Forgot your password?"} <a href="#" onClick={this.resetPassword}>Click here</a> to reset it.
                </div>
            </form>
        </div>

        return result;
    }
});
