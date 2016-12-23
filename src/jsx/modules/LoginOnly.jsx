/*global OneRoost*/
/*global window*/
/*global console*/
/*global alert*/
/*global clearTimeout*/
/*global setTimeout*/
import React from "react"
import Parse from "parse";
Parse.serverURL = OneRoost.Config.parseSeverURL;
import SpinnerIcon from "./SpinnerIcon"
import { browserHistory, withRouter } from "react-router"
import {linkState} from "./util/LinkState"

const LoginOnly = withRouter(
    React.createClass({
        getInitialState: function(){
            var username;
            var isLoggedIn = false;
            var email = null;
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
                passwordValidation: ""
            };
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
                user.set("username", this.state.email.toLowerCase());
                user.set("email", this.state.email.toLowerCase());
                user.set("password", this.state.password);
                user.set("firstName", this.state.firstName);
                user.set("lastName", this.state.lastName);
                user.set("passwordChangeRequired", false);
                user.signUp( null, {
                    success: component.handleLoginSuccess,
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
            this.refs.spinner.doShow();
        },
        hideLoading(){
            this.refs.spinner.doHide();
        },
        handleLoginError: function(user, error)
        {
            console.error(error);
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

            this.hideLoading();
        },
        handleLoginSuccess: function(){
            const { location } = this.props;
            if (location.state && location.state.nextPathname && window.location.pathname != location.state.nextPathname) {
                this.props.router.replace(location.state.nextPathname)
            } else {
                this.props.router.replace("/roosts")
            }
        },
        handleLogoutSuccess: function(){
            browserHistory.push("/");
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
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(this.state.email);
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



            var result =
            <div className="LoginOnly">
                <form className="container-fluid col-md-offset-4 col-md-4">
                    {error}
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
                    <div className="form-group">
                        <br/>
                        <button className="btn btn-primary btn-block" id="loginSubmitBtn" onClick={this.doLogin}>{btnText} <SpinnerIcon ref="spinner"></SpinnerIcon></button>
                    </div>
                    <div className="forgotPassword">
                        Forgot your password{"?"} <a href="#" onClick={this.resetPassword}>Click here</a> to reset it.
                    </div>
                </form>
            </div>

            return result;
        }
    })
);

export default LoginOnly;
