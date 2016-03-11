import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import Deal from './../../models/Deal';
import DealComment from './../../models/DealComment';
import AddComment from './AddComment';
import CommentItem from './CommentItem';
import $ from 'jquery';

export default React.createClass({
    mixins: [ParseReact.Mixin],
    getInitialState: function(){
        return {
            commentLimit: 100
        }
    },
    observe: function(props, state){
        var self = this;
        return {
            dealComments: (new Parse.Query('DealComment')).equalTo( 'deal', self.props.deal ).descending('createdAt').limit( self.state.commentLimit )
        }
    },
    componentDidMount: function(props, state) {
        window.addEventListener("resize", this.scrollToBottom);
    },
    componentWillUnmount: function(props, state) {
        window.removeEventListener("resize", this.scrollToBottom);
    },
    componentDidUpdate: function(props, state)
    {
        this.scrollToBottom();
    },
    scrollToBottom: function()
    {
        var $commentContainer = $(this.refs.messagesContainer);
        $commentContainer.scrollTop( $commentContainer.prop("scrollHeight") );
    },
    render: function(){
        var component = this;
        var deal = this.props.deal;
        var previousComment = null;

        var commentsSection = (null);
        if (this.pendingQueries().length > 0)
        {
            commentsSection = (
                <div>LOADING <i className="fa fa-spinner fa-spin"></i></div>
            );
        }

        var comments = this.data.dealComments.sort(function(a, b){
            return a.createdAt.getTime() > b.createdAt.getTime();
        });

        var commentsSection = (
            <ul className="list-unstyled" id="commentsList" ref="commentList">
                {comments.map(function(comment){
                    var item = ( <CommentItem key={"commentItem_" + comment.objectId}
                    comment={comment}
                    previousComment={previousComment} /> );
                    previousComment = comment;
                    return item;
                })}
            </ul>
        );

        return (
            <div className={"commentsSection container-fluid col-xs-12 col-md-" + this.props.columns}>
                <div className="messagesContainer" ref="messagesContainer">
                    <div className="">
                        {commentsSection}
                    </div>
                </div>
                <AddComment
                    ref="addComment"
                    deal={deal} >
                </AddComment>
            </div>
        );
    }
});
