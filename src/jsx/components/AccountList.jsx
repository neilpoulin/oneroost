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
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Account</th>
                        <th>Deal Name</th>
                        <th>Primary Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {this.data.deals.map(function(deal){
                      return <tr className="profileCard">
                          <td>{accountMap[deal.account.objectId].accountName}</td>
                          <td><a href={"/deals/" + deal.objectId} >{deal.dealName}</a></td>
                          <td>{accountMap[deal.account.objectId].primaryContact}</td>
                      </tr>
                    })}
                </tbody>
            </table>
        )
    }
  });
});
