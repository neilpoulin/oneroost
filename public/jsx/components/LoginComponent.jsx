define( ['react', 'parse', 'SpinnerIcon'], function(React, Parse, SpinnerIcon){
  return React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function(){
      var username;
      var password;
      var isLoggedIn = false;
      var email = null;
      var user = Parse.User.current();
      if ( user )
      {
          username = user.get("username");
          isLoggedIn = true;
          email = user.get("email");
        //   this.handleLoginSuccess(user);
      }
      return {
        isLoggedIn: isLoggedIn,
        username: username,
        password: null,
        email: email,
        isLogin: false
      };
    },
    doLogin: function(e){
      e.preventDefault();
      var component = this;
      debugger;
      if ( this.state.isLogin )
      {
        console.log("logging in for user: " + this.state.username + ", password: " + this.state.password);

        Parse.User.logIn(this.state.username, this.state.password, {
            success: component.handleLoginSuccess,
            error: component.handleLoginError
        });
      }
      else {
          var user = new Parse.User();
          user.set("username", this.state.email);
          user.set("email", this.state.email);
          user.set("password", this.state.password);

          user.signUp( null, {
              success: component.handleLoginSuccess,
              error: component.handleLoginError
          });
      }

      return this.showLoading();
    },
    doLogout: function(e){
      e.preventDefault();
      var component = this;
      this.showLoading();
      Parse.User.logOut().done(component.handleLogoutSuccess).fail(component.handleLogoutError);
    },
    showLoading(){
        this.refs.spinner.doShow();
    },
    handleLoginError: function(user, error)
    {
      // new ManageTodosView();
      // self.undelegateEvents();
      // delete self;
      return this.render();
    },
    handleLoginSuccess: function(user){
      this.setState({
        isLoggedIn: true,
        username: user.get("username"),
        password: user.get("password"),
        email: user.get("email")
      });
      if ( this.props.success )
      {
        this.props.success();
      }
      return this.render();
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
    handleLogoutError: function(){

    },
    setIsRegister: function(e){
      this.setState({isLogin: false});
    },
    setIsLogin: function(e){
      this.setState({isLogin: true});
    },
    render: function(){
      if ( this.state.isLoggedIn )
      {
        return (
            <div className="row">
                <div className="container">
                    <div className="LogoutComponent row">
                      You are logged in as  {this.state.username} (<a href="#" onClick={this.doLogout}>log out</a>) <SpinnerIcon ref="spinner"></SpinnerIcon>
                    </div>
                    <div className="row">
                        <h2>Pages</h2>
                        <ul className="list-unstyled">
                            <li><a href="/my/home">My Accounts</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
      }
      var registerLoginMessage;
      var btnText = "Log In";
      if ( this.state.isLogin )
      {
        registerLoginMessage = (
          <div>
            Don't have an account? <a onClick={this.setIsRegister}>Create one here</a>.
          </div>
        );
      }
      else {
        btnText = "Sign Up";
        registerLoginMessage = (
          <div>
            Already have an account? <a onClick={this.setIsLogin}>Login here</a>.
          </div>
        );
      }

      return (
        <div className="LoginComponent">
            <form >
              <div className="form-component">
                <label for="loginUsernameInput">Email</label>
                <input type="text" id="loginEmailInput" className="form-control" valueLink={this.linkState('email')} placeholder=""/>
              </div>
              <div className="form-component">
                <label for="loginPasswordInput">Password</label>
                <input type="password" id="loginPasswordInput" className="form-control" valueLink={this.linkState('password')}/>
              </div>
              <div className="form-component">
                <br/>
                <button className="btn btn-primary btn-block" id="loginSubmitBtn" onClick={this.doLogin}>{btnText} <SpinnerIcon ref="spinner"></SpinnerIcon></button>
              </div>
              {registerLoginMessage}
            </form>
        </div>
      );
    }
  });
});
