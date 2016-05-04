import React from "react";

export default React.createClass({
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return date.toLocaleString();
    },
    render: function(){
        var comment = this.props.comment;
        var isSystem = comment.author == null;
        var commentId = comment.author != null ? comment.author.objectId : null;
        var hasPreviousCommentAuthor = this.props.previousComment != null && this.props.previousComment.author != null;
        var previousCommentAuthorId = hasPreviousCommentAuthor ? this.props.previousComment.author.objectId : null;

        var sameAuthorAsPrevious = commentId == previousCommentAuthorId;
        var result =
        <li className={"comment " + (isSystem ? "system " : "") + (sameAuthorAsPrevious ? "repeatAuthor " : "") }>
            <div className="container-fluid">
                <div className="row authorRow">
                    <span className="username">{comment.username}</span>
                    &nbsp;
                    <span className="postTime">{this.formatCommentDate(comment)}</span>
                </div>
                <div className="row">
                    <span className="message">{comment.message}</span>
                </div>
            </div>
        </li>
        return result;
    }
});
