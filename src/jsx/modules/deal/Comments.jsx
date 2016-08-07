import React, {PropTypes} from "react";
import ReactDOM from "react-dom"
import Parse from "parse";
import ParseReact from "parse-react";
import AddComment from "./AddComment";
import CommentItem from "./CommentItem";
import CommentDateSeparator from "./CommentDateSeparator";
import Notification from "./../Notification";
import $ from "jquery";
import io from "socket.io-client"

export default React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return{
        }
    },
    getInitialState: function(){
        return {
            commentLimit: 100
        }
    },
    observe: function(props, state){
        var self = this;
        return {
            dealComments: (new Parse.Query("DealComment")).include("author").equalTo( "deal", self.props.deal ).descending("createdAt").limit( self.state.commentLimit )
        }
    },
    componentDidMount: function() {
        window.addEventListener("resize", this.scrollToBottom);
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
    },
    componentWillUnmount: function(props, state) {
        window.removeEventListener("resize", this.scrollToBottom);
    },
    componentDidUpdate: function(props, state)
    {
        this.scrollToBottom();
    },
    scrollToBottom: function()
    {
        var $commentContainer = $(this.refs.messagesContainer);
        $commentContainer.scrollTop( $commentContainer.prop("scrollHeight") );
    },
    calculateDimensions: function(){
        var addCommentBounding = ReactDOM.findDOMNode( this.refs.addComment ).getBoundingClientRect();
        this.refs.messagesContainer.style.bottom = addCommentBounding.height + "px";
        this.scrollToBottom();
    },
    isSameDate(nextDate, previousDate)
    {
        var dateToCheck = nextDate;
        var actualDate = previousDate;
        var isSameDay = actualDate != null
        && dateToCheck.getDate() == actualDate.getDate()
        && dateToCheck.getMonth() == actualDate.getMonth()
        && dateToCheck.getFullYear() == actualDate.getFullYear();
        return isSameDay;
    },
    forceShowUsername: function( currentDate, previousDate )
    {
        var isSameDate = this.isSameDate( currentDate, previousDate );
        var elapsedMinutes = ( currentDate.getTime() - ( previousDate != null ? previousDate.getTime() : 0) ) / 1000 / 60;
        return !isSameDate || elapsedMinutes > 30;
    },
    render: function(){
        var component = this;
        var deal = this.props.deal;
        var previousComment = null;

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
            // var comments = this.data.dealComments.sort(function(a, b){
            //     return a.createdAt.getTime() > b.createdAt.getTime();
            // });
            var comments = this.data.dealComments.slice(0);
            comments.reverse();
            var items = [];

            comments.forEach(function(comment){
                var currentDate = comment.createdAt
                var previousDate = previousComment != null ? previousComment.createdAt : null;
                var isSameDate = component.isSameDate( currentDate, previousDate );

                if ( !isSameDate )
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
            <ul className="list-unstyled" id="commentsList" ref="commentList">
                {items.map(function(item){
                    return item;
                })}
            </ul>;
        }

        var result =
        <div className={"commentsSection container-fluid col-xs-12 col-md-" + this.props.columns}>
            <div className="messagesContainer" ref="messagesContainer">
                <div className="">
                    {commentsSection}
                </div>
            </div>
            <AddComment
                ref="addComment"
                deal={deal}
                onHeightChange={this.calculateDimensions} >
            </AddComment>
        </div>

        return result;
    }
});
