define( ['react', 'models/DealComment',], function( React, DealComment ){
    return React.createClass({
        formatCommentDate: function( comment )
        {
            var date = comment.createdAt;
            return date.toLocaleString();
        },
        render: function(){
            var comment = this.props.comment;
            return (
                <li className="comment">
                    <div className="container">
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
