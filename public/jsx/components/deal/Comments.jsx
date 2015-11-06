define( ['underscore', 'react', 'parse', 'parse-react', 'models/Deal', 'models/DealComment', 'deal/AddComment'],
function(_, React, Parse, ParseReact, Deal, DealComment, AddComment){
  return React.createClass({
      mixins: [ParseReact.Mixin],
      observe: function(){
        return {
          dealComments: (new Parse.Query(DealComment)).equalTo( 'deal', this.props.deal ).descending('createdAt')
        }
      },
      addComment: function( comment )
      {
          this.refreshQueries('dealComments');
          this.render();
      },
      render: function(){
          var deal = this.props.deal;
          var comments = this.data.dealComments;
          return (
              <div>
                  <ul>
                    {comments.map(function(comment){
                        return <li>
                            <b>{comment.username}:</b>&nbsp;{comment.message}
                        </li>
                    })}
                  </ul>
                  <AddComment
                      ref="addComment"
                      deal={deal}
                      addComment={this.addComment}
                       ></AddComment>
              </div>
            );
      }
  });
})
