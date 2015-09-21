define( ['react', 'SpinnerIcon'], function(React, SpinnerIcon){
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
      }
      return {
        isLoggedIn: isLoggedIn,
        username: username,
        password: null
      };
    },
    doLogin: function(e){
      e.preventDefault();
      var component = this;
      console.log("logging in for user: " + this.state.username + ", password: " + this.state.password);

      Parse.User.logIn(this.state.username, this.state.password, {
          success: component.handleLoginSuccess,
          error: component.handleLoginError
      });
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
      return this.render();
    },
    handleLogoutSuccess: function()
    {
      this.setState({
        isLoggedIn: false,
        username: null,
        password: null
      });
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
    render: function(){
      if ( this.state.isLoggedIn )
      {
        return (
          <div className="LogoutComponent">
            <a href="#" onClick={this.doLogout}>Logout from {this.state.username}</a><SpinnerIcon ref="spinner"></SpinnerIcon>
          </div>
        );
      }

      return (
        <div className="LoginComponent">
            <form >
              <div class="form-component">
                <label for="loginUsernameInput">Username</label>
                <input type="text" id="loginUsernameInput" className="form-control" onChange={this.handleUsernameChange} placeholder="username"/>
              </div>
              <div class="form-component">
                <label for="loginPasswordInput">Password</label>
                <input type="password" id="loginPasswordInput" className="form-control" onChange={this.handlePasswordChange}/>
              </div>
              <button className="button btn-primary" id="loginSubmitBtn" onClick={this.doLogin}>Login <SpinnerIcon ref="spinner"></SpinnerIcon></button>
            </form>
        </div>
      );
    }
  });
});
