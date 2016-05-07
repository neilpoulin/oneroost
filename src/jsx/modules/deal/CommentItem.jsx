import React, {PropTypes} from "react";
import moment from "moment";

export default React.createClass({
    propTypes: {
        comment: PropTypes.shape({
            author: PropTypes.object,
            createdAt: PropTypes.instanceOf(Date).isRequired
        }).isRequired,
        previousComment: PropTypes.shape({
            author: PropTypes.object
        }),
        forceShowUsername: PropTypes.bool.isRequired
    },
    getDefaultProps: function(){
        return {
            forceShowUsername: false
        }
    },
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return moment(date).format("h:m a");
    },
    render: function(){
        var comment = this.props.comment;
        var commentId = comment.author != null ? comment.author.objectId || comment.author.id : null;

        var previousComment = this.props.previousComment;
        var previousCommentAuthor = previousComment != null ? previousComment.author : null;

        var previousCommentAuthorId = previousCommentAuthor != null ? previousComment.author.objectId || previousComment.author.id : null;
        var isSystem = comment.author == null;

        var sameAuthorAsPrevious = commentId == previousCommentAuthorId && commentId != null;
        var result =
        <li className={"comment " + (isSystem ? "system " : "") + (!this.props.forceShowUsername && sameAuthorAsPrevious ? "repeatAuthor " : "") }>
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
