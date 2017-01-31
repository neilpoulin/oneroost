import React, {PropTypes} from "react";
import SystemComment from "SystemComment"
import UserComment from "UserComment"

export default React.createClass({
    propTypes: {
        comment: PropTypes.object.isRequired,
        previousComment: PropTypes.object,
        forceShowUsername: PropTypes.bool,
    },
    getDefaultProps: function(){
        return {
            forceShowUsername: false
        }
    },
    render: function(){
        const {comment, previousComment, forceShowUsername} = this.props;
        const isSystem = comment.author == null;
        if ( isSystem )
        {
            return <SystemComment comment={comment}/>
        }

        var commentAuthorId = comment.author != null ? comment.author.objectId : null;
        var previousCommentAuthor = previousComment != null ? previousComment.author : null;
        var previousCommentAuthorId = previousCommentAuthor != null ? previousCommentAuthor.objectId : null;
        var sameAuthorAsPrevious = commentAuthorId == previousCommentAuthorId && commentAuthorId != null;
        var showAuthor = forceShowUsername || !sameAuthorAsPrevious;

        var result = <UserComment comment={comment} showAuthor={showAuthor}/>
        return result;
    }
});
