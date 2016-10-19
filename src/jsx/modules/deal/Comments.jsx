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
import RoostUtil from "./../util/RoostUtil"

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
            commentLimit: 100,
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
        if (this.state.currentPage == 0)
        {
            this.scrollToBottom();
        }
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
            var comments = this.data.dealComments.slice(0).concat(this.state.additionalComments);
            comments.reverse();
            var items = [];

            comments.forEach(function(comment){
                var currentDate = comment.createdAt
                var previousDate = previousComment != null ? previousComment.createdAt : null;
                var isSameDate = RoostUtil.isSameDate( currentDate, previousDate );

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

        var moreButton = null
        if ( this.state.lastFetchCount == null && this.data.dealComments || this.state.lastFetchCount === this.state.commentLimit )
        {
            moreButton = <button className="btn btn-outline-primary" onClick={this.getNextPage}>Load More</button>
        }

        var result =
        <div className={"commentsSection container-fluid col-xs-12 col-md-" + this.props.columns}>
            <div className="messagesContainer" ref="messagesContainer">
                <div className="">
                    {moreButton}
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
