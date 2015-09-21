define( ['react', 'models/Account'], function(React, Account){
  return React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function(){
      return {
          accountName: null,
          primaryContact: null,
          streetAddress: null,
          city: null,
          state: null,
          zipCode: null
      };
    },
    setAccountName: function(e)
    {
      this.setState({accountName: e.target.value});
    },
    doSubmit: function()
    {
      var component = this;
      var account = new Account();
      account.set("createdBy", this.props.user);
      account.set("accountName", this.state.accountName);
      account.set("primaryContact", this.state.primaryContact);
      account.set("streetAddress", this.state.streetAddress);
      account.set("city", this.state.city);
      account.set("state", this.state.state);
      account.set("zipCode", this.state.zipCode);

      account.save(null, {
        success: component.createSuccess,
        error: component.createError
      });

    },
    createSuccess: function(){
      if ( this.props.createSuccess )
      {
        this.props.createSuccess();
      }
    },
    createError: function(){
      if ( this.props.createError )
      {
        this.props.createError("Failed to create an account. ");
      }
    },
    render: function(){
      return (
        <div className="CreateAccount">
          <div>Create Account Form for {this.props.user.get("username")}</div>
          <div>
            <div className="form-component">
              <label for="accountNameInput" >Account Name</label>
              <input id="accountNameInput" type="text" className="form-control" valueLink={this.linkState('accountName')} />
            </div>
            <div className="form-component" >
              <label for="primaryContactInput">Primary Contact Name</label>
              <input id="primaryContactInput" type="text" className="form-control" valueLink={this.linkState('primaryContact')} />
            </div>
          </div>
        </div>
      );
    }
  });
});
