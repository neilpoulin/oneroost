import React, { PropTypes } from "react"
import Linkify from "react-linkify"
import moment from "moment";

const UserComment = React.createClass({
    propTypes: {
        comment: PropTypes.shape({
            author: PropTypes.object
            // createdAt: PropTypes.instanceOf(Date).isRequired
        }).isRequired,
        showAuthor: PropTypes.bool.isRequired
    },
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return moment(date).format("h:mm A");
    },
    render () {
        var comment = this.props.comment;

        var result =
        <li className={"comment " + (!this.props.showAuthor ? "repeatAuthor " : "")}
            key={"dealComment_" + comment.objectId }>
            <div className="container-fluid">
                <div className="row authorRow">
                    <span className="username" title={comment.author.email}>{comment.author.firstName + " " + comment.author.lastName}</span>
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
