import React from 'react';
import DealComment from './../../models/DealComment';


export default React.createClass({
    formatCommentDate: function( comment )
    {
        var date = comment.createdAt;
        return date.toLocaleString();
    },
    render: function(){
        var comment = this.props.comment;
        var isSystem = comment.author == null;
        var sameAuthorAsPrevious = ( comment.author != null ?
                                        comment.author.objectId :
                                        null ) ==
                                        ( ( this.props.previousComment != null && this.props.previousComment.author != null ) ?
                                            this.props.previousComment.author.objectId :
                                            null );
        return (
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
        )
    }
});
