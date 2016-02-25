import React from 'react'
import LoginComponent from './LoginComponent'

export default React.createClass({
    handleLoginSuccess: function(){
      document.location = "/my/home";
    },
    render: function(){
      return (
        <div className="container ">
          <div className="row">
            <div className="page-header">
                <h1 className="text-center">Welcome to One Roost</h1>
            </div>
          </div>
          <div className="row">
              <div className="container ">
                  <div className="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
                      <LoginComponent success={this.handleLoginSuccess} ></LoginComponent>
                  </div>
              </div>
          </div>
        </div>
      );
    }
})
