define(['parse', 'parse-react', 'react', 'models/Account'], function(Parse, ParseReact, React, Account){
  return React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
      var accounts = [];
      if ( this.props.user )
      {
        accounts = (new Parse.Query(Account)).equalTo('createdBy', this.props.user )
      }
      return {
        accounts: accounts
      }
    },
    render: function(){
        return (
          <ul>
            {this.data.accounts.map(function(account){
              return <div className="profileCard">
                <h3>{account.accountName}</h3>
                <div>Contact: {account.primaryContact}</div>
              </div>
            })}
          </ul>
        )
    }
  });
});
