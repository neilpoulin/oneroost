define(['parse', 'parse-react', 'react', 'jquery', 'examples/BootstrapModal', 'CreateAccount', 'AccountList', 'LoginComponent'],
function( Parse, ParseReact, React, jQuery, BootstrapModal, CreateAccount, AccountList, LoginComponent ){
  return React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
      var user = Parse.User.current();
      return {
        // accounts: (new Parse.Query(Parse.User)).ascending('createdAt').limit(10)
      }
    },
    handleLoginSuccess: function(){
      document.location = "/my/home";
    },
    onAddAccount: function(e){
        this.refs.addAccountModal.open();
    },
    closeAddAccountModal: function(e){
      this.refs.addAccountModal.close();
      this.clearAddAccountForm();
    },
    saveNewAccount: function(){
      console.log("saving account...");
      var success = this.refs.createAccountForm.doSubmit();
      if ( success )
      {
        this.closeAddAccountModal();
        // this.render();
      }
    },
    getCurrentUser: function()
    {
      return Parse.User.current();
    },
    clearAddAccountForm: function(){
      this.refs.createAccountForm.setState( this.refs.createAccountForm.getInitialState() );
    },
    showError: function(message){
      alert(message);
    },
    accountCreateSuccess: function(){
      this.closeAddAccountModal();
      this.refs.accountList.refreshQueries('accounts');
      this.render();
    },
    logoutSuccess: function(){
      window.location = "/";
    },
    render: function(){
      var currentUser = this.getCurrentUser();
      var accountCreateForm = (
        <CreateAccount
          user={currentUser}
          ref="createAccountForm"
          createSuccess={this.accountCreateSuccess}
          createError={this.showError}
           >
        </CreateAccount>
      );

      var addAccountModal = (
        <BootstrapModal
                ref="addAccountModal"
                confirm="Add"
                cancel="Cancel"
                onCancel={this.closeAddAccountModal}
                onConfirm={this.saveNewAccount}
                title="Add a new account">
            A modal to add a new account

            {accountCreateForm}

        </BootstrapModal>
      );

      var accounts = (
        <AccountList
          ref="accountList"
          user={currentUser} >
        </AccountList>
      );

      if ( !this.getCurrentUser() )
      {
        document.location = "/";
        return;
      }

      return (
        <div className="container-fluid">
          <LoginComponent logoutSuccess={this.logoutSuccess} ></LoginComponent>
          <div className="col-md-6 col-md-offset-3">
            <div className="row">
              <h1>My Accounts</h1>
              <div className="container-fluid">
                  {addAccountModal}
                  <button className="btn btn-default" onClick={this.onAddAccount} >Add Account</button>
              </div>
            </div>
            <div className="row">
              {accounts}
            </div>
          </div>
        </div>
      );
    }
  });
});
