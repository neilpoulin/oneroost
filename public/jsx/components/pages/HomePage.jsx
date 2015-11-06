define(['react', 'LoginComponent'], function( React, LoginComponent ){
  return React.createClass({
    handleLoginSuccess: function(){
      document.location = "/my/home";
    },
    render: function(){
      return (
        <div className="container ">
          <div className="row">
              <h1>Welcome to One Roost</h1>
          </div>
          <LoginComponent success={this.handleLoginSuccess} ></LoginComponent>
        </div>
      );
    }
  });
});
