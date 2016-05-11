import React, { PropTypes } from "react"
import moment from "moment";

const SystemComment = React.createClass({
    propTypes: {
        comment: PropTypes.shape({
            author: PropTypes.object,
            createdAt: PropTypes.instanceOf(Date).isRequired
        }).isRequired
    },
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return moment(date).format("h:mm A");
    },
    render () {
        var comment = this.props.comment;
        var result =
        <li className="comment system"
            key={"dealComment_" + comment.objectId } >            
            <div className="container-fluid">
                <div className="row">
                    <span className="message">{comment.message}</span>
                    <span className="postTime"> ({this.formatCommentDate(comment)})</span>
                </div>
            </div>
        </li>
        return result;
    }
})

export default SystemComment
