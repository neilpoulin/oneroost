define( ['react', 'models/DealComment',], function( React, DealComment ){
    return React.createClass({
        formatCommentDate: function( comment )
        {
            var date = comment.createdAt;
            return date.toLocaleString();
        },
        render: function(){
            var comment = this.props.comment;
            var isSystem = comment.author == null;
            return (
                <li className={"comment " + (isSystem ? "system" : "")}>
                    <div className="container-fluid">
                        <div className="row">
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
});
