define( [ 'react', 'parse', 'parse-react', 'models/Deal', 'models/DealComment', 'deal/AddComment', 'deal/CommentItem'],
function( React, Parse, ParseReact, Deal, DealComment, AddComment, CommentItem ){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(props, state){
            var self = this;
            return {
                dealComments: (new Parse.Query('DealComment')).equalTo( 'deal', self.props.deal ).ascending('createdAt')
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
            var commentsHeaderHeightPx = $(".commentsHeader").outerHeight();

            var $msgContainer = $(".messagesContainer");
            var messageListHeight = commentsTopPx + commentsHeaderHeightPx;
            $msgContainer.css({top: messageListHeight });
            this.scrollToBottom();
        },
        render: function(){
            var component = this;
            var deal = this.props.deal;
            var commentsSection = (
                <ul className="list-unstyled" id="commentsList" ref="commentList">
                    {this.data.dealComments.map(function(comment){
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
                <div className="commentsSection">
                    <div className="commentsHeader">
                        <h2>Comments</h2>
                    </div>
                    <div className="row-fluid">
                        <div className="messagesContainer" ref="messagesContainer">
                            <div className="container">
                                {commentsSection}
                            </div>
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
