import React from "react";
import Parse from "Parse";
import ParseReact from "parse-react";

export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        console.log("observing");
        return {
            users: (new Parse.Query(Parse.User)).ascending("createdAt").limit(10)
        }
    },
    render: function(){
        return (
            <div className="container">
                {this.data.users.map(function(user){
                    return <div className="col-md-3 profileCard">
                        <h3>{user.username}</h3>
                        <div>UserId: {user.id}</div>
                    </div>
                })}
            </div>
        )
    }
});
