import React, { PropTypes } from "react"
import moment from "moment";
import NavLink from "NavLink";

const SystemComment = React.createClass({
    propTypes: {
        comment: PropTypes.shape({
            author: PropTypes.object
            // createdAt: PropTypes.instanceOf(Date).isRequired
        }).isRequired
    },
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return moment(date).format("h:mm A");
    },
    buildLink: function(comment){
        if ( comment.navLink )
        {
            var path = "/";

            switch (comment.navLink.type) {
                case "step":
                    path = "/steps"
                    break;
                case "participant":
                    path ="/participants";
                    break;
                case "investment":
                    path = "/budget"
                    break;
                case "timeline":
                    path = "/timeline"
                    break;
                case "document":
                    path = "/documents";
                    break;
                default:
                    break;
            }
            var link = "/roosts/" + comment.deal.objectId + path;
            if ( comment.navLink.id )
            {
                link += "/" + comment.navLink.id;
            }

            return link;
        }
        return null;
    },
    render () {
        var comment = this.props.comment;
        var onboarding = this.props.comment.onboarding;
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

        var link = this.buildLink(comment);
        var message = <span className="message">{comment.message}</span>
        if ( link )
        {
            message =
            <NavLink tag="span" to={link} className="messageLink message">
                {comment.message}
            </NavLink>
        }

        var result =
        <li className={"comment system" + ( onboarding ? " onboarding": "" )}
            key={"dealComment_" + comment.objectId } >
            <div className="container-fluid">
                {author}
                <div className="row">
                    {message}
                    {postTime}
                </div>
            </div>
        </li>
        return result;
    }
})

export default SystemComment
