import React, {PropTypes} from "react";
import SystemComment from "SystemComment"
import UserComment from "UserComment"
import Parse from "parse";

export default React.createClass({
    propTypes: {
        comment: PropTypes.instanceOf(Parse.Object).isRequired,
        previousComment: PropTypes.instanceOf(Parse.Object),
        forceShowUsername: PropTypes.bool,
    },
    getDefaultProps: function(){
        return {
            forceShowUsername: false
        }
    },
    render: function(){
        const {comment, previousComment, forceShowUsername} = this.props;
        const isSystem = comment.get("author") == null;
        if ( isSystem )
        {
            return <SystemComment comment={comment}/>
        }

        var commentAuthorId = comment.get("author") != null ? comment.get("author").id : null;
        var previousCommentAuthor = previousComment != null ? previousComment.get("author") : null;
        var previousCommentAuthorId = previousCommentAuthor != null ? previousCommentAuthor.id : null;
        var sameAuthorAsPrevious = commentAuthorId == previousCommentAuthorId && commentAuthorId != null;
        var showAuthor = forceShowUsername || !sameAuthorAsPrevious;

        var result = <UserComment comment={comment} showAuthor={showAuthor}/>
        return result;
    }
});
