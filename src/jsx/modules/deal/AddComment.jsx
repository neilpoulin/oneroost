import React from 'react';
import ParseReact from 'parse-react';
import Parse from 'parse';
import DealComment from './../../models/DealComment';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            message: null,
            user: Parse.User.current()
        };
    },
    saveComment: function( comment )
    {
        console.log("submitting comment: " + this.state.message);
        var comment = {
            message: this.state.message,
            author: this.state.user,
            username: this.state.user.get("username"),
            deal: this.props.deal
        };

        ParseReact.Mutation.Create('DealComment', comment).dispatch();
        this.setState({message: ''});
    },
    handleKeyDown: function( event )
    {
        if ( event.keyCode == 13 )
        {
            event.preventDefault();
            this.saveComment();
        }
    },
    render: function(){
        var deal = this.props.deal;
        return (
            <div className="addCommentContainer row-fluid">
                <div className="input-group">
                    <textarea className="form-control custom-control input-lg"
                        id="addCommentInput"
                        placeholder="Write your message..."
                        rows="1"
                        valueLink={this.linkState('message')}
                        onKeyDown={this.handleKeyDown} ></textarea>
                    <span className="input-group-addon btn btn-primary" onClick={this.saveComment} >Send</span>
                </div>
            </div>
        );
    }
});