import React, { PropTypes } from "react"
import moment from "moment"
import NavLink from "NavLink"
import {getUrl} from "LinkTypes"

const SystemComment = React.createClass({
    propTypes: {
        comment: PropTypes.object.isRequired,
    },
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return moment(date).format("h:mm A");
    },
    render () {
        var {comment} = this.props
        var onboarding = comment.onboarding
        let message = comment.message
        var postTime = <span className="postTime">{this.formatCommentDate(comment)}</span>
        var author = null;
        if ( onboarding){
            author =
            <div className="row authorRow">
                <span className="username" title="help@oneroost.com">OneRoost Team</span>
                &nbsp;
                <span className="postTime">{this.formatCommentDate(comment)}</span>
            </div>
            postTime = null;
        }

        var messageWrapper = <span className="message">{message}</span>
        if ( comment.navLink )
        {
            messageWrapper =
            <NavLink tag="span" to={getUrl(comment.navLink, comment.deal.objectId)} className="messageLink message">
                {message}
            </NavLink>
        }

        var result =
        <li className={"comment system" + ( onboarding ? " onboarding": "" )}
            key={"dealComment_" + comment.objectId } >
            <div className="container-fluid">
                {author}
                <div className="row">
                    {messageWrapper}
                    {postTime}
                </div>
            </div>
        </li>
        return result;
    }
})

export default SystemComment
