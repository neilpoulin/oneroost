define( [ 'react', 'parse', 'parse-react', 'models/Deal', 'models/DealComment', 'deal/AddComment', 'deal/CommentItem'],
function( React, Parse, ParseReact, Deal, DealComment, AddComment, CommentItem ){
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
        scrollToBottom: function()
        {
            var $commentContainer = $(this.refs.messagesContainer.getDOMNode());
            $commentContainer.scrollTop( $commentContainer.prop("scrollHeight") );
        },
        updateDimensions: function(){
            var commentsTopPx = $(".commentsSection").position().top;
            var commentsHeaderHeightPx = $(".commentsHeader").outerHeight();

            var $msgContainer = $(".messagesContainer");
            var messageListHeight = commentsTopPx + commentsHeaderHeightPx;
            $msgContainer.css({top: messageListHeight });
            this.scrollToBottom();
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
                        <div className="messagesContainer" ref="messagesContainer">
                            <div className="container">
                                <ul className="list-unstyled" id="commentsList" ref="commentList">
                                    {comments.map(function(comment){
                                        return ( <CommentItem comment={comment} /> )
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
