import React, {PropTypes} from "react";
import Parse from "parse";
import AddComment from "AddComment";
import CommentItem from "CommentItem";
import CommentDateSeparator from "CommentDateSeparator";
import Notification from "Notification";
import io from "socket.io-client"
import RoostUtil from "RoostUtil"

export default React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        sidebarOpen: PropTypes.bool
    },
    getDefaultProps: function(){
        return{
            sidebarOpen: false
        }
    },
    getInitialState: function(){
        return {
            commentLimit: 200,
            comments: [],
            additionalComments: [],
            page: 0,
            lastFetchCount: null,
            loading: true,
        }
    },

    getNextPage(){
        var self = this;
        var currentPage = this.state.page;
        var nextPage = currentPage + 1;
        var additionalComments = this.state.additionalComments
        var query = new Parse.Query("DealComment")
        query.include("author")
        query.equalTo( "deal", this.props.deal.id )
        query.descending("createdAt")
        query.skip( this.state.commentLimit * nextPage )
        query.limit( this.state.commentLimit );

        query.find()
        .then( function(results){
            results.forEach( function(comment){
                additionalComments.push( comment.toJSON() )
            })
            if ( results.length == 0)
            {
                nextPage = currentPage
            }
            self.setState( {additionalComments: additionalComments, page: nextPage, lastFetchCount: results.length} )
        }).catch(error => console.error(error));

    },
    componentWillMount(){
        const self = this;
        const {deal} = this.props;
        const {commentLimit} = this.state;
        const commentQuery = new Parse.Query("DealComment")
        commentQuery.include("author").equalTo( "deal", deal ).descending("createdAt").limit( commentLimit );

        commentQuery.find().then(comments => {
            self.setState({
                comments: comments,
                loading: false,
            });
        }).catch(error => console.error(error));
    },
    componentDidMount: function() {
        // window.addEventListener("resize", this.scrollToBottom);
        var self = this;
        const {deal} = this.props;
        var socket = io("/DealComment");
        socket.on("connect", function() {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit("deal", self.props.deal.objectId);
        });

        socket.on("comment", function(comment){
            var senderName = RoostUtil.getFullName(comment.author);
            Notification.sendNotification({
                title: senderName + " | " + deal.get("dealName"),
                body: comment.message,
                tag: comment.objectId
            });
            //TODO: refresh queries on new comments
            // self.refreshQueries(["dealComments"]);
        });
        //doing this so that iOS records the scrollTop position correctly.
        var messageContainer = this.refs.messagesContainer;
        messageContainer.ontouchstart = function () {
            // console.log("touchstart scrollTop " + messageContainer.scrollTop )
        };

        messageContainer.onscroll = function(){
            // console.log("onscroll scrollTop " + messageContainer.scrollTop )
        }
    },
    componentWillUpdate: function(nextProps, nextState) {
        var node = this.refs.messagesContainer;
        var buffer = 50;
        var currentPosition = node.scrollTop + node.offsetHeight;
        this.shouldScrollBottom = currentPosition + buffer >= node.scrollHeight;
        //TODO: record width changes and scale the scroll position accordingly
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    },
    componentDidUpdate: function(prevProps, prevState) {
        var node = this.refs.messagesContainer;
        if (this.shouldScrollBottom || this.scrollTop === 0) {
            this.scrollBottom();
        }
        else {
            var newPosition =this.scrollTop + (node.scrollHeight - this.scrollHeight);
            node.scrollTop = newPosition;
        }
    },
    scrollBottom(){
        var node = this.refs.messagesContainer;
        node.scrollTop = node.scrollHeight;
        //Note: doing this so that mobile works a bit better
        setTimeout(function(){
            node.scrollTop = node.scrollHeight;
        }, 200);
    },
    scrollBottomIfNeeded(height){
        var node = this.refs.messagesContainer;
        var buffer = 25;
        var currentPosition = node.scrollTop + node.offsetHeight;
        var shouldScrollBottom = currentPosition + buffer >= node.scrollHeight;
        if (shouldScrollBottom) {
            this.scrollBottom();
        }
    },
    forceShowUsername: function( currentDate, previousDate )
    {
        if ( currentDate != null & !(currentDate instanceof Date) ){
            currentDate = new Date(currentDate);
        }
        if ( previousDate != null && !(previousDate instanceof Date) )
        {
            previousDate = new Date(previousDate)
        }

        var isSameDate = RoostUtil.isSameDate( currentDate, previousDate );
        var elapsedMinutes = ( currentDate.getTime() - ( previousDate != null ? previousDate.getTime() : 0) ) / 1000 / 60;
        return !isSameDate || elapsedMinutes > 30;
    },
    render: function(){
        const component = this;
        const {deal} = this.props;
        const {comments, commentLimit, lastFetchCount} = this.state;
        var commentsSection = null;
        if (this.state.loading)
        {
            commentsSection =
            <div className="loadingComments lead">
                <i className="fa fa-spinner fa-spin"></i>
                &nbsp; Loading Comments...
            </div>;
        }
        else if ( this.state.comments.length == 0 )
        {
            commentsSection =
            <div className="emptyComments lead">
                There are no comments yet, add one below to get started!
            </div>;
        }
        else
        {
            var allComments = comments.slice(0).concat(this.state.additionalComments);
            allComments = allComments.reverse();
            var items = [];
            var previousComment = null;
            allComments.forEach(function(comment){
                var currentDate = comment.get("createdAt");
                var previousDate = previousComment != null ? previousComment.get("createdAt") : null;
                var isSameDate = RoostUtil.isSameDate( currentDate, previousDate );

                if ( !isSameDate || previousComment == null )
                {
                    var separator =
                    <CommentDateSeparator
                        key={"dateSeparator_comment_" + comment.id }
                        previousDate={previousDate}
                        nextDate={comment.createdAt}
                        />
                    items.push( separator );
                }

                var forceShowUsername = component.forceShowUsername(currentDate, previousDate);
                var item =
                <CommentItem key={"commentItem_" + comment.id}
                    comment={comment}
                    previousComment={previousComment}
                    forceShowUsername={forceShowUsername}
                    />;
                items.push(item);
                previousComment = comment;
            })
            commentsSection =
            <ul className="list-unstyled commentsList" id="commentsList" ref="commentList">
                {items.map(function(item){
                    return item;
                })}
            </ul>;
        }

        var moreButton = null
        if ( lastFetchCount == null && comments.length === commentLimit || lastFetchCount === commentLimit )
        {
            moreButton = <button className="btn btn-outline-primary loadMore" onClick={this.getNextPage}>Load Previous Comments</button>
        }
        else if ( lastFetchCount != null && lastFetchCount < commentLimit ){
             moreButton = <div className="messageStart">This is the start of the message history</div>
        }

        var result =
        <div className={"commentsSection container-fluid"}>
            <div className="messagesContainer" ref="messagesContainer">
                {moreButton}
                {commentsSection}
            </div>
            <AddComment
                ref="addComment"
                deal={deal}
                onHeightChange={this.scrollBottomIfNeeded}>
            </AddComment>
        </div>

        return result;
    }
});
