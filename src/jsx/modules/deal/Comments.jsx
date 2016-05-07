import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import AddComment from "./AddComment";
import CommentItem from "./CommentItem";
import CommentDateSeparator from "./CommentDateSeparator";
import $ from "jquery";

export default React.createClass({
    mixins: [ParseReact.Mixin],
    getInitialState: function(){
        return {
            commentLimit: 100
        }
    },
    observe: function(props, state){
        var self = this;
        return {
            dealComments: (new Parse.Query("DealComment")).equalTo( "deal", self.props.deal ).descending("createdAt").limit( self.state.commentLimit )
        }
    },
    componentDidMount: function(props, state) {
        window.addEventListener("resize", this.scrollToBottom);
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
    render: function(){
        var component = this;
        var deal = this.props.deal;
        var previousComment = null;

        var commentsSection = null;
        if (component.pendingQueries().length > 0)
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
            var comments = this.data.dealComments.sort(function(a, b){
                return a.createdAt.getTime() > b.createdAt.getTime();
            });
            var items = [];

            comments.forEach(function(comment){
                var isSameDate = component.isSameDate( comment.createdAt, previousComment != null ? previousComment.createdAt : null )
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

                var item =
                <CommentItem key={"commentItem_" + comment.objectId}
                    comment={comment}
                    previousComment={previousComment}
                    forceShowUsername={!isSameDate}
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
                deal={deal} >
            </AddComment>
        </div>

        return result;
    }
});
