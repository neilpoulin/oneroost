define(['react', 'parse', 'parse-react'], function(React, Parse, ParseReact){
  return React.createClass({
    mixins: [ParseReact.Mixin],
    getInitialState: function(){
      var module = this;
      var result = (new Parse.Query(Parse.User)).ascending('createdAt').limit(10).find({
        success: function(resp){
          console.log("success!");
          console.log(resp);
          // module.data.users = resp;
          module.setState({"users": resp});
        },
        error: function(resp){
          console.log("somethign went wrong");
        }
      });

      return {
        users: [],
        username: "Unknown Username",
        id: "0"
      }
    },
    observe: function(){
      console.log("observing");
      return {
        users: (new Parse.Query(Parse.User)).ascending('createdAt').limit(10)
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
});
