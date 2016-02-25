define( ['react', 'parse-react', 'parse', 'models/DealComment'], function(React, ParseReact, Parse, DealComment){
  return React.createClass({
      mixins: [React.addons.LinkedStateMixin],
      getInitialState: function(){
        return {
            message: null,
            user: Parse.User.current()
        };
      },
      saveComment: function( comment )
      {
        console.log("submitting comment: " + this.state.message);
        var comment = {
            message: this.state.message,
            author: this.state.user,
            username: this.state.user.get("username"),
            deal: this.props.deal
        };

        ParseReact.Mutation.Create('DealComment', comment).dispatch();      
        this.setState({message: ''});
      },
      handleKeyDown: function( event )
      {
        if ( event.keyCode == 13 )
        {
            event.preventDefault();
            this.saveComment();
        }
      },
      render: function(){
        var deal = this.props.deal;
        return (
            <div className="addCommentContainer row-fluid">
                <div className="input-group">
                    <textarea className="form-control custom-control"
                        id="addCommentInput"
                        rows="1"
                        valueLink={this.linkState('message')}
                        onKeyDown={this.handleKeyDown} ></textarea>
                    <span className="input-group-addon btn btn-primary" onClick={this.saveComment} >Send</span>
                </div>
            </div>
        );
      }
  });
})
