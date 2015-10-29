define(['underscore', 'parse', 'parse-react', 'react', 'models/Account', 'models/Deal'], function(_, Parse, ParseReact, React, Account, Deal){
  return React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
      var accounts = [];
      var deals = [];
      if ( this.props.user )
      {
        accounts = (new Parse.Query(Account)).equalTo('createdBy', this.props.user );
        deals = (new Parse.Query(Deal)).equalTo('createdBy', this.props.user );
      }
      return {
        accounts: accounts,
        deals: deals
      }
    },
    render: function(){
        window.deals = this.data.deals;
        window.accounts = this.data.accounts;

        var accountMap = {};
        _.map(this.data.accounts, function(act){
            accountMap[act.objectId] = act;
        });
        window.accountMap = accountMap;
        return (
          <ul>
            {this.data.deals.map(function(deal){
              return <div className="profileCard">
                  <a href={"/deals/" + deal.objectId} >
                      <h3>{accountMap[deal.account.objectId].accountName}</h3>
                      <h2>{deal.dealName}</h2>
                      <div>Contact: {accountMap[deal.account.objectId].primaryContact}</div>
                  </a>
              </div>
            })}
          </ul>
        )
    }
  });
});
