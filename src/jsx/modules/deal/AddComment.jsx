import React, {PropTypes} from "react";
import ParseReact from "parse-react";
import Parse from "parse";
import LinkedStateMixin from "react-addons-linked-state-mixin";
import AutosizeTextarea from "react-textarea-autosize";

export default React.createClass({
    mixins: [LinkedStateMixin],
    getInitialState: function(){
        return {
            message: "",
            user: Parse.User.current()
        };
    },
    propTypes: {
        onHeightChange: PropTypes.func,
        deal: PropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            onHeightChange: function(){
                console.log("warning: no onHeightChange function specified for AddComment.jsx");
            }
        }
    },
    saveComment: function( comment )
    {
        var msg = this.formatMessage( this.state.message )
        var parseUser = Parse.User.current();
        var user = {
            firstName: parseUser.get("firstName"),
            lastName: parseUser.get("lastName"),
            email: parseUser.get("email"),
            className: "_User",
            objectId: parseUser.id
        };

        var comment = {
            message: msg,
            author: user,
            username: this.state.user.get("username"),
            deal: this.props.deal
        };

        ParseReact.Mutation.Create("DealComment", comment).dispatch();
        this.setState({message: ""});
    },
    formatMessage(msg)
    {
        msg = msg.replace(/\n\n+/g,"\n\n");
        return msg.trim();
    },
    handleKeyDown: function( event )
    {
        // if ( event.keyCode == 13 )
        // {
        //     event.preventDefault();
        //     this.saveComment();
        // }
    },
    onTextAreaResize(height){
        this.refs.addButton.style.height = height + "px";
        this.props.onHeightChange();
    },
    render: function(){
        var addComment =
        <div className="addCommentContainer row-fluid">
            <div className="input-group">
                <AutosizeTextarea
                    className="form-control custom-control"
                    maxRows={10}
                    minRows={1}
                    ref="textInput"
                    onChange={e => this.setState({message: e.target.value})}
                    value={this.state.message}
                    onHeightChange={this.onTextAreaResize}
                    ></AutosizeTextarea>

                <div className="input-group-btn" >
                    <button
                        ref="addButton"
                        className="btn btn-primary"
                        onClick={this.saveComment} >Send</button>
                </div>
            </div>
        </div>
        return addComment;
    }
});
