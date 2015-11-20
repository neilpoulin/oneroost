define( ['underscore', 'react', 'parse', 'parse-react', 'models/Deal', 'models/DealComment', 'deal/AddComment'],
function(_, React, Parse, ParseReact, Deal, DealComment, AddComment){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(){
            return {
                dealComments: new Parse.Query('DealComment').equalTo( 'deal', this.props.deal ).ascending('createdAt')
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
        componentDidMount: function() {
            window.addEventListener("resize", this.updateDimensions);
        },
        componentWillUnmount: function() {
            window.removeEventListener("resize", this.updateDimensions);
        },
        componentDidUpdate: function()
        {
            this.updateDimensions();
        },
        updateDimensions: function(){
            var $commentList = $(this.refs.commentList.getDOMNode());
            $commentList.scrollTop( $commentList.prop("scrollHeight") );

            var commentsTopPx = $(".commentsSection").position().top;
            var commentsHeaderHeightPx = $(".commentsHeader").outerHeight();

            var $msgContainer = $(".messagesContainer");
            var messageListHeight = commentsTopPx + commentsHeaderHeightPx;
            $msgContainer.css({top: messageListHeight });
        },
        render: function(){
            var component = this;
            var deal = this.props.deal;
            var comments = this.data.dealComments;
            return (
                <div className="commentsSection">
                    <div className="commentsHeader">
                        <h2>Comments</h2>
                    </div>
                    <div className="row-fluid">
                        <div className="messagesContainer">
                            <div className="container">
                                <ul className="list-unstyled" id="commentsList" ref="commentList">
                                    {comments.map(function(comment){
                                        return <li className="comment hover-effects">
                                            <span className="username">{comment.username}</span>:&nbsp;<span className="message">{comment.message}</span>
                                            <span className="postTime hover-show">{component.formatCommentDate(comment)}</span>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <AddComment
                        ref="addComment"
                        deal={deal}
                        addComment={this.addComment} >
                    </AddComment>
                </div>
            );
        }
    });
})
