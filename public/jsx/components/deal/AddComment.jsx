define( ['react', 'parse-react', 'parse', 'models/DealComment'], function(React, ParseReact, Parse, DealComment){
  return React.createClass({
      mixins: [React.addons.LinkedStateMixin],
      getInitialState: function(){
        return {
            message: null,
            user: Parse.User.current()
        };
      },
      saveComment: function()
      {
        console.log("submitting comment: " + this.state.message);
        var component = this;
        var comment = new DealComment();
        comment.set("message", this.state.message);
        comment.set("author", this.state.user);
        comment.set("username", this.state.user.get("username"));
        comment.set("deal", this.props.deal);

        // need to wait for version 0.5 to come out for parse-react to use this
        //  var creator = ParseReact.Mutation.Create('DealComment', {
        //         message: this.state.message,
        //         author: this.state.user,
        //         username: this.state.user.get("username"),
        //         deal: this.props.deal
        //       });
        // creator.dispatch();

        comment.save(null, {
              success: function( comment ){
                  console.log("save success");
                  component.setState({message: ''});
                  component.props.addComment( comment );
              },
              error: function(){
                  console.error( "failed to save comment");
              }
          });
      },
      render: function(){
          var deal = this.props.deal;
          return (
              <div>
                  <div className="row-fluid">
                        <div className="form-group">
                            <textarea className="form-control" valueLink={this.linkState('message')} ></textarea>
                        </div>
                  </div>
                  <div className="row-fluid">
                        <div className="form-group">
                            <button type="submit" className="btn btn-lg btn-primary" onClick={this.saveComment}>Post</button>
                        </div>
                  </div>
              </div>

            );
      }
  });
})
