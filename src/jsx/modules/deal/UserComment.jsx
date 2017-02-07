import React, { PropTypes } from "react"
import Linkify from "react-linkify"
import moment from "moment"
import * as RoostUtil from "RoostUtil"

const UserComment = React.createClass({
    propTypes: {
        comment: PropTypes.object.isRequired,
        showAuthor: PropTypes.bool.isRequired
    },
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return moment(date).format("h:mm A");
    },
    render () {
        const {comment, showAuthor} = this.props;
        const author = comment.author
        const authorName = RoostUtil.getFullName(author);
        var result =
        <li className={"comment " + (!showAuthor ? "repeatAuthor " : "")}
            key={"dealComment_" + comment.objectId }>
            <div className="container-fluid">
                <div className="row authorRow">
                    <span className="username">{authorName}</span>
                    &nbsp;
                    <span className="postTime">{this.formatCommentDate(comment)}</span>
                </div>
                <div className="row">
                    <Linkify properties={{target: "_blank"}}><span className="message">{comment.message}</span></Linkify>
                </div>
            </div>
        </li>
        return result;
    }
})

export default UserComment
