define(['react', 'LoginComponent'], function( React, LoginComponent ){
  return React.createClass({
    handleLoginSuccess: function(){
      document.location = "/my/home";
    },
    render: function(){
      return (
        <div className="container-fluid">
          <h1>Welcome to Next Steps</h1>
          <div className="container col-md-4 col-md-offset-4">
              <LoginComponent success={this.handleLoginSuccess} ></LoginComponent>
          </div>
        </div>
      );
    }
  });
});
