'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _reactAddonsLinkedStateMixin = require('react-addons-linked-state-mixin');

var _reactAddonsLinkedStateMixin2 = _interopRequireDefault(_reactAddonsLinkedStateMixin);

var _SpinnerIcon = require('./SpinnerIcon');

var _SpinnerIcon2 = _interopRequireDefault(_SpinnerIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'LoginComponent',

    mixins: [_reactAddonsLinkedStateMixin2.default],
    getInitialState: function getInitialState() {
        var username;
        var password;
        var isLoggedIn = false;
        var email = null;
        var user = _parse2.default.User.current();
        if (user) {
            username = user.get("username");
            isLoggedIn = true;
            email = user.get("email");
        }
        return {
            isLoggedIn: isLoggedIn,
            username: username,
            password: null,
            email: email,
            isLogin: window.location.pathname.indexOf("login") != -1,
            error: null,
            isTyping: false,
            emailValidation: null,
            passwordValidation: null
        };
    },
    doLogin: function doLogin(e) {
        e.preventDefault();
        var component = this;
        this.showLoading();
        if (this.state.isLogin) {
            console.log("logging in for email: " + this.state.email + ", password: " + this.state.password);

            _parse2.default.User.logIn(this.state.email, this.state.password, {
                success: component.handleLoginSuccess,
                error: component.handleLoginError
            });
        } else {
            var user = new _parse2.default.User();
            user.set("username", this.state.email);
            user.set("email", this.state.email);
            user.set("password", this.state.password);

            user.signUp(null, {
                success: component.handleLoginSuccess,
                error: component.handleLoginError
            });
        }
    },
    doLogout: function doLogout(e) {
        e.preventDefault();
        var component = this;
        this.showLoading();
        _parse2.default.User.logOut().done(component.handleLogoutSuccess).fail(component.handleLogoutError);
    },
    showLoading: function showLoading() {
        this.refs.spinner.doShow();
    },
    hideLoading: function hideLoading() {
        this.refs.spinner.doHide();
    },

    handleLoginError: function handleLoginError(user, error) {
        switch (error.code) {
            case 101:
                //invalid login params
                break;
            case 202:
                //username taken
                break;
            default:
                break;
        }
        this.setState({ "error": error });
        this.hideLoading();
    },
    handleLoginSuccess: function handleLoginSuccess(user) {
        this.setState({
            isLoggedIn: true,
            username: user.get("username"),
            password: user.get("password"),
            email: user.get("email")
        });
        if (this.props.success) {
            this.props.success();
        }
        return this.render();
    },
    handleLogoutSuccess: function handleLogoutSuccess() {
        this.setState({
            isLoggedIn: false,
            username: null,
            password: null,
            email: null
        });

        if (this.props.logoutSuccess) {
            this.props.logoutSuccess();
        }
        return this.render();
    },
    handleLogoutError: function handleLogoutError(user, error) {
        console.error("failed to log out");
        console.error(error);
    },
    setIsRegister: function setIsRegister(e) {
        this.setState({ isLogin: false,
            emailValidation: null,
            passwordValidation: null,
            error: null });
    },
    setIsLogin: function setIsLogin(e) {
        this.setState({ isLogin: true,
            emailValidation: null,
            passwordValidation: null,
            error: null });
    },
    resetPassword: function resetPassword() {
        if (this.state.email != null) {
            _parse2.default.User.requestPasswordReset(this.state.email, {
                success: function success() {
                    // Password reset request was sent successfully
                    alert("reset request successful");
                },
                error: function error(_error) {
                    // Show the error message somewhere
                    alert("Error: " + _error.code + " " + _error.message);
                }
            });
        } else {
            //todo: tell the use to enter an email
        }
    },
    emailKeyUp: function emailKeyUp() {
        var self = this;
        if (this.emailTypingTimeout != null) {
            clearTimeout(self.emailTypingTimeout);
        }
        if (self.state.emailValidation != null && self.isValidEmail()) {
            self.doEmailValidation();
        } else {
            self.emailTypingTimeout = setTimeout(function () {
                self.doEmailValidation();
            }, 500);
        }
    },
    doEmailValidation: function doEmailValidation() {
        var email = this.state.email;
        if (email && email.length > 2 && !this.isValidEmail()) {
            this.setState({ emailValidation: {
                    message: "Please enter a valid email",
                    level: "error"
                } });
        } else {
            this.setState({ emailValidation: null });
        }
    },
    isValidEmail: function isValidEmail() {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.state.email);
    },
    emailTypingTimeout: null,
    passwordKeyUp: function passwordKeyUp() {
        var self = this;
        if (self.passwordTypingTimeout != null) {
            clearTimeout(self.passwordTypingTimeout);
        }
        if (self.state.passwordValidation != null && self.isValidPassword()) {
            self.doPasswordValidation();
        } else {
            this.passwordTypingTimeout = setTimeout(function () {
                self.doPasswordValidation();
            }, 500);
        }
    },
    doPasswordValidation: function doPasswordValidation() {
        var password = this.state.password;
        if (password && password.length > 1 && !this.isValidPassword()) {
            this.setState({ passwordValidation: {
                    message: "Your password must be at least 4 characters long",
                    level: "error"
                } });
        } else {
            this.setState({ passwordValidation: null });
        }
    },
    passwordTypingTimeout: null,
    isValidPassword: function isValidPassword() {
        var password = this.state.password || "";
        return password.length > 3;
    },
    render: function render() {
        if (this.state.isLoggedIn) {
            return _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(
                    'div',
                    { className: 'container' },
                    _react2.default.createElement(
                        'div',
                        { className: 'LogoutComponent row' },
                        'You are logged in as  ',
                        this.state.username,
                        ' (',
                        _react2.default.createElement(
                            'a',
                            { href: '#', onClick: this.doLogout },
                            'log out'
                        ),
                        ') ',
                        _react2.default.createElement(_SpinnerIcon2.default, { ref: 'spinner' })
                    )
                )
            );
        }

        var btnText = this.state.isLogin ? "Log In" : "Sign Up";

        var tabs = _react2.default.createElement(
            'ul',
            { className: 'nav nav-tabs nav-justified' },
            _react2.default.createElement(
                'li',
                { role: 'presentation ', className: "pointer " + (this.state.isLogin ? "" : "active") },
                _react2.default.createElement(
                    'a',
                    { onClick: this.setIsRegister },
                    'Sign Up'
                )
            ),
            _react2.default.createElement(
                'li',
                { role: 'presentation', className: "pointer " + (this.state.isLogin ? "active" : "") },
                _react2.default.createElement(
                    'a',
                    { onClick: this.setIsLogin },
                    'Login'
                )
            )
        );

        var error = _react2.default.createElement('div', null);
        if (this.state.error) {
            error = _react2.default.createElement(
                'div',
                { className: 'errorMessage alert alert-danger' },
                this.state.error.message
            );
        }

        var emailHelpBlock = "";
        var emailValidationClass = "";

        var passwordHelpBlock = "";
        var passwordValidationClass = "";

        if (this.state.emailValidation) {
            emailHelpBlock = this.state.emailValidation.message;
            emailValidationClass = "has-" + this.state.emailValidation.level;
        }

        if (this.state.passwordValidation) {
            passwordHelpBlock = this.state.passwordValidation.message;
            passwordValidationClass = "has-" + this.state.passwordValidation.level;
        }

        return _react2.default.createElement(
            'div',
            { className: 'LoginComponent' },
            _react2.default.createElement(
                'div',
                { className: '' },
                tabs
            ),
            _react2.default.createElement(
                'form',
                { className: 'container-fluid' },
                error,
                _react2.default.createElement(
                    'div',
                    { className: "form-group " + emailValidationClass },
                    _react2.default.createElement(
                        'label',
                        { 'for': 'loginUsernameInput', className: 'control-label' },
                        'Email'
                    ),
                    _react2.default.createElement('input', { type: 'email', id: 'loginEmailInput', className: 'form-control', valueLink: this.linkState('email'), onKeyUp: this.emailKeyUp, placeholder: '', 'aria-describedby': 'emailHelpBlock' }),
                    _react2.default.createElement(
                        'span',
                        { className: 'help-block', id: 'emailHelpBlock' },
                        emailHelpBlock
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: "form-group " + passwordValidationClass },
                    _react2.default.createElement(
                        'label',
                        { 'for': 'loginPasswordInput', className: 'control-label' },
                        'Password'
                    ),
                    _react2.default.createElement('input', { type: 'password', id: 'loginPasswordInput', className: 'form-control', valueLink: this.linkState('password'), onKeyUp: this.passwordKeyUp, 'aria-describedby': 'passwordHelpBlock' }),
                    _react2.default.createElement(
                        'span',
                        { className: 'help-block', id: 'passwordHelpBlock' },
                        passwordHelpBlock
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'form-group' },
                    _react2.default.createElement('br', null),
                    _react2.default.createElement(
                        'button',
                        { className: 'btn btn-primary btn-block', id: 'loginSubmitBtn', onClick: this.doLogin },
                        btnText,
                        ' ',
                        _react2.default.createElement(_SpinnerIcon2.default, { ref: 'spinner' })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: "forgotPassword " + (this.state.isLogin ? "" : "hidden") },
                    'Forgot your password? ',
                    _react2.default.createElement(
                        'a',
                        { href: '#', onClick: this.resetPassword },
                        'Click here'
                    ),
                    ' to reset it.'
                )
            )
        );
    }
});