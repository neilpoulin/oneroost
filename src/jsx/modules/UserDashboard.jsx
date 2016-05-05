import React, { PropTypes } from 'react'
import Parse from 'parse';
import ParseReact from 'parse-react';

const UserDashboard = React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
        var user = Parse.User.current();
        var dealQuery = new Parse.Query(Deal);
        dealQuery.include("account");
        return {
            user: user,
            deals: (dealQuery).equalTo('createdBy', user )
        }
    },
    render () {
        return (
            <div className="UserDashboard">
                Hello!
            </div>
        )
    }
})

export default UserDashboard
