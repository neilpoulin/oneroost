import React, {PropTypes} from "react";
import SystemComment from "./SystemComment"
import UserComment from "./UserComment"

export default React.createClass({
    propTypes: {
        comment: PropTypes.shape({
            author: PropTypes.object
            // createdAt: PropTypes.instanceOf(Date).isRequired
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
    render: function(){
        var comment = this.props.comment;
        var isSystem = comment.author == null;
        if ( isSystem )
        {
            return <SystemComment comment={comment}/>
        }

        var commentAuthorId = comment.author != null ? comment.author.objectId || comment.author.id : null;
        var previousComment = this.props.previousComment;
        var previousCommentAuthor = previousComment != null ? previousComment.author : null;
        var previousCommentAuthorId = previousCommentAuthor != null ? previousComment.author.objectId || previousComment.author.id : null;
        var sameAuthorAsPrevious = commentAuthorId == previousCommentAuthorId && commentAuthorId != null;
        var showAuthor = this.props.forceShowUsername || !sameAuthorAsPrevious;

        var result = <UserComment comment={comment} showAuthor={showAuthor}/>
        return result;
    }
});
