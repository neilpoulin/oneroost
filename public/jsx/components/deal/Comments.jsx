define( ['underscore', 'react', 'parse', 'parse-react', 'models/Deal', 'models/DealComment', 'deal/AddComment'],
function(_, React, Parse, ParseReact, Deal, DealComment, AddComment){
  return React.createClass({
      mixins: [ParseReact.Mixin],
      observe: function(){
        return {
          dealComments: new Parse.Query('DealComment').equalTo( 'deal', this.props.deal ).descending('createdAt')
        }
      },
      addComment: function( comment )
      {
          this.refreshQueries('dealComments');
          this.render();
      },
      formatCommentDate: function( comment )
      {
        var date = comment.createdAt;
        return date.toLocaleString();
      },
      render: function(){
          var component = this;
          var deal = this.props.deal;
          var comments = this.data.dealComments;
          return (
              <div className="commentsSection row-fluid">
                  <h2>Comments</h2>
                  <AddComment
                      ref="addComment"
                      deal={deal}
                      addComment={this.addComment} >
                  </AddComment>

                  <ul className="list-unstyled" id="commentsContainer">
                    {comments.map(function(comment){
                        return <li className="comment hover-effects">
                            <span className="username">{comment.username}</span>:&nbsp;<span className="message">{comment.message}</span>
                            <span className="postTime hover-show">{component.formatCommentDate(comment)}</span>
                        </li>
                    })}
                  </ul>

              </div>
            );
      }
  });
})
