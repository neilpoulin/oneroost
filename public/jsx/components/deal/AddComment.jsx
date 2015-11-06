define( ['react', 'parse', 'parse-react', 'models/DealComment'], function(React, Parse, ParseReact, DealComment){
  return React.createClass({
      mixins: [ParseReact.Mixin, React.addons.LinkedStateMixin],
      getInitialState: function(){
        return {
            message: null,
            user: Parse.User.current()
        };
      },
      observe: function(){
        return {

        }
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
                  <div className="row">
                        <div className="form-group">
                            <textarea className="form-control" valueLink={this.linkState('message')} ></textarea>
                        </div>
                  </div>
                  <div className="row">
                        <div className="form-group">
                            <button type="submit" className="btn btn-lg btn-primary" onClick={this.saveComment}>Post</button>
                        </div>
                  </div>
              </div>

            );
      }
  });
})
