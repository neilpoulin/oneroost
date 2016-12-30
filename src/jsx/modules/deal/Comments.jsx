import React, {PropTypes} from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import AddComment from "AddComment";
import CommentItem from "CommentItem";
import CommentDateSeparator from "CommentDateSeparator";
import Notification from "Notification";
import io from "socket.io-client"
import RoostUtil from "RoostUtil"

export default React.createClass({
    mixins: [ParseReact.Mixin],
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
            additionalComments: [],
            page: 0,
            lastFetchCount: null
        }
    },
    observe: function(props, state){
        var self = this;
        return {
            dealComments: (new Parse.Query("DealComment")).include("author").equalTo( "deal", self.props.deal ).descending("createdAt").limit( self.state.commentLimit )
        }
    },
    getNextPage(){
        var self = this;
        var currentPage = this.state.page;
        var nextPage = currentPage + 1;
        var additionalComments = this.state.additionalComments
        var query = new Parse.Query("DealComment")
        query.include("author")
        query.equalTo( "deal", this.props.deal )
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
        });

    },
    componentDidMount: function() {
        // window.addEventListener("resize", this.scrollToBottom);
        var self = this;
        var socket = io("/DealComment");
        socket.on("connect", function() {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit("deal", self.props.deal.objectId);
        });

        socket.on("comment", function(comment){
            var deal = self.props.deal;
            var senderName = comment.author.firstName + " " + comment.author.lastName;
            Notification.sendNotification({
                title: senderName + " | " + deal.dealName,
                body: comment.message,
                tag: comment.objectId
            });
            self.refreshQueries(["dealComments"]);
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
        var component = this;
        var deal = this.props.deal;

        var commentsSection = null;
        if (component.pendingQueries().length > 0 && this.data.dealComments.length == 0)
        {
            commentsSection =
            <div className="loadingComments lead">
                <i className="fa fa-spinner fa-spin"></i>
                &nbsp; Loading Comments...
            </div>;
        }
        else if ( this.data.dealComments.length == 0 )
        {
            commentsSection =
            <div className="emptyComments lead">
                There are no comments yet, add one below to get started!
            </div>;
        }
        else
        {
            var comments = this.data.dealComments.slice(0).concat(this.state.additionalComments);
            comments = comments.reverse();
            var items = [];
            var previousComment = null;
            comments.forEach(function(comment){
                var currentDate = comment.createdAt
                var previousDate = previousComment != null ? previousComment.createdAt : null;
                var isSameDate = RoostUtil.isSameDate( currentDate, previousDate );

                if ( !isSameDate || previousComment == null )
                {
                    var separator =
                    <CommentDateSeparator
                        key={"dateSeparator_comment_" + comment.objectId }
                        previousDate={previousComment != null ? previousComment.createdAt : null}
                        nextDate={comment.createdAt}
                        />
                    items.push( separator );
                }

                var forceShowUsername = component.forceShowUsername(currentDate, previousDate);
                var item =
                <CommentItem key={"commentItem_" + comment.objectId}
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
        if ( this.state.lastFetchCount == null && this.data.dealComments.length === this.state.commentLimit || this.state.lastFetchCount === this.state.commentLimit )
        {
            moreButton = <button className="btn btn-outline-primary loadMore" onClick={this.getNextPage}>Load Previous Comments</button>
        }
        else if ( this.state.lastFetchCount != null && this.state.lastFetchCount < this.state.commentLimit ){
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
