import React from "react"
import Parse from "parse"
import SpinnerIcon from "SpinnerIcon"
import { browserHistory, withRouter } from "react-router"
import FormInputGroup from "FormInputGroup"
import {loginValidation} from "RegistrationValidations"
import FormUtil from "FormUtil"

const LoginOnly = withRouter(
    React.createClass({
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
                loading: false,
                errors: {},
            };
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
            let {errors} = this.state;
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
            errors.alert = error.message;
            this.setState({"errors": errors});

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
        doSubmit(){
            let errors = FormUtil.getErrors(this.state, loginValidation);
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
        render: function(){
            let {email, errors, password} = this.state
            if ( this.state.isLoggedIn )
            {
                return false;
            }

            var btnText = this.state.isLogin ? "Log In" : "Sign Up";

            var alert = null;
            if ( errors.alert )
            {
                alert =
                <div className="errorMessage alert alert-danger">
                    {this.state.errors.alert}
                </div>;
            }

            var result =
            <div className="LoginOnly">
                <form className="container-fluid col-md-offset-4 col-md-4">
                    {alert}
                    <FormInputGroup
                        fieldName="email"
                        value={email}
                        label="Email"
                        errors={errors}
                        onChange={val => this.setState({"email": val})}
                        />

                    <FormInputGroup
                        fieldName="password"
                        value={password}
                        label="Password"
                        errors={errors}
                        type={"password"}
                        onChange={val => this.setState({"password": val})}
                        />

                    <div className="">
                        <span className="btn btn-primary btn-block" id="loginSubmitBtn" onClick={this.doSubmit}>{btnText} <SpinnerIcon visible={this.state.loading}/></span>
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
