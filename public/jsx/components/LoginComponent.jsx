define( ['react', 'parse', 'SpinnerIcon'], function(React, Parse, SpinnerIcon){
  return React.createClass({
    getInitialState: function(){
      var username;
      var password;
      var isLoggedIn = false;
      var user = Parse.User.current();
      if ( user )
      {
          username = user.get("username");
          isLoggedIn = true;
        //   this.handleLoginSuccess(user);
      }
      return {
        isLoggedIn: isLoggedIn,
        username: username,
        password: null,
        isLogin: false
      };
    },
    doLogin: function(e){
      e.preventDefault();
      var component = this;

      if ( this.state.isLogin )
      {
        console.log("logging in for user: " + this.state.username + ", password: " + this.state.password);

        Parse.User.logIn(this.state.username, this.state.password, {
            success: component.handleLoginSuccess,
            error: component.handleLoginError
        });
      }
      else {
        Parse.User.signUp( this.state.username, this.state.password, {ACL: new Parse.ACL()}, {
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
        password: user.get("password")
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
        password: null
      });

      if ( this.props.logoutSuccess )
      {
        this.props.logoutSuccess();
      }

      return this.render();
    },
    handleLogoutError: function(){

    },
    handleUsernameChange: function(e){
      this.setState({"username": e.target.value});
    },
    handlePasswordChange: function(e){
      this.setState({"password": e.target.value});
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
                <label for="loginUsernameInput">User Name</label>
                <input type="text" id="loginUsernameInput" className="form-control" onChange={this.handleUsernameChange} placeholder=""/>
              </div>
              <div className="form-component">
                <label for="loginPasswordInput">Password</label>
                <input type="password" id="loginPasswordInput" className="form-control" onChange={this.handlePasswordChange}/>
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
