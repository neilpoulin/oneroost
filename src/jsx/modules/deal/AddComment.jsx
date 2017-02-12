import React, {PropTypes} from "react"
import Parse from "parse"
import {Pointer as DealPointer} from "models/Deal"
import {Pointer as UserPointer} from "models/User"
import AutosizeTextarea from "react-textarea-autosize"
import {createComment} from "ducks/roost/comments"
import { connect } from "react-redux"
import * as log from "LoggingUtil"

const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addComment: (message) => {
            let user = Parse.User.current().toJSON();
            dispatch(createComment({
                message: message,
                author: UserPointer(user),
                username: user.username,
                deal: DealPointer(ownProps.deal)
            }))
        }
    }
}

const AddComment = React.createClass({
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
                log.info("warning: no onHeightChange function specified for AddComment.jsx");
            }
        }
    },
    saveComment()
    {
        var msg = this.formatMessage( this.state.message )
        this.props.addComment(msg);
        this.setState({"message": ""});
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
        this.props.onHeightChange(height);
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
                    placeholder={"Send a message"}
                    onChange={e => this.setState({message: e.target.value})}
                    onBlur={e => this.props.onHeightChange}
                    value={this.state.message}
                    onHeightChange={this.onTextAreaResize}
                    ></AutosizeTextarea>

                <div className="input-group-btn" >
                    <button
                        ref="addButton"
                        className="btn btn-secondary"
                        onClick={this.saveComment}
                        >
                        Send</button>
                </div>
            </div>
        </div>
        return addComment;
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddComment)
