import React from 'react'
import Parse from 'parse';
import ParseReact from 'parse-react';
import Deal from './../../models/Deal';
import Account from './../../models/Account';
import AccountSidebarList from './AccountSidebarList';


export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        var dealQuery = new Parse.Query(Deal);
        dealQuery.include("account");
        dealQuery.ascending('dealName');
        return {
            deals: (dealQuery).equalTo('createdBy', user )
        }
    },
    render () {
        var contents;
        if ( this.pendingQueries().length > 0 ){
            contents = (
                <div>Loading....</div>
            )
        }
        else {
            contents = <AccountSidebarList deals={this.data.deals} />
        }


        return (
            <div id="accountSidebar" className="col-md-2 container-fluid hidden-sm hidden-xs">
                {contents}
            </div>

        )
    }
})
