define( [ 'react', 'parse', 'parse-react', 'models/Deal', 'models/DealComment', 'deal/AddComment', 'deal/CommentItem'],
function( React, Parse, ParseReact, Deal, DealComment, AddComment, CommentItem ){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        getInitialState: function(){
            return {
                commentLimit: 100
            }
        },
        observe: function(props, state){
            var self = this;
            return {
                dealComments: (new Parse.Query('DealComment')).equalTo( 'deal', self.props.deal ).descending('createdAt').limit( self.state.commentLimit )
            }
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
            // var commentsHeaderHeightPx = $(".commentsHeader").outerHeight();
            var accountSidebarWidthPx = $("#accountSidebar").outerWidth();
            var $msgContainer = $(".messagesContainer");
            var $addCommentContainer = $(".addCommentContainer");

            var messageListHeight = commentsTopPx + 50; // + commentsHeaderHeightPx;
            $msgContainer.css({top: messageListHeight, left: accountSidebarWidthPx + 25 });
            $addCommentContainer.css({left: accountSidebarWidthPx + 25 });
            this.scrollToBottom();
        },
        render: function(){
            var component = this;
            var deal = this.props.deal;

            var commentsSection = (
                <ul className="list-unstyled" id="commentsList" ref="commentList">
                    {this.data.dealComments.reverse().map(function(comment){
                        return ( <CommentItem comment={comment} /> )
                    })}
                </ul>
            );

            if (this.pendingQueries().length)
            {
                console.log("pending queries for comments:");
                console.log(this.pendingQueries());
                commentsSection = (
                    <div>LOADING <i className="fa fa-spinner fa-spin"></i></div>
                );
            }

            return (
                <div className="commentsSection container-fluid">
                    <div className="messagesContainer" ref="messagesContainer">
                        <div className="">
                            {commentsSection}
                        </div>
                    </div>
                    <AddComment
                        ref="addComment"
                        deal={deal} >
                    </AddComment>
                </div>
            );
        }
    });
})
