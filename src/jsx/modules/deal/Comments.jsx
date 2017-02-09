import React, {PropTypes} from "react";
import Parse from "parse";
import { connect } from "react-redux"
import AddComment from "AddComment";
import CommentItem from "CommentItem";
import CommentDateSeparator from "CommentDateSeparator";

import {Pointer} from "models/Deal"
// import io from "socket.io-client"
import * as RoostUtil from "RoostUtil"
import {Map} from "immutable"
import {denormalize} from "normalizr"
import * as Comment from "models/DealComment"
import {loadComments, subscribeComments} from "ducks/roost/comments"

const Comments = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        sidebarOpen: PropTypes.bool
    },
    getDefaultProps: function(){
        return{
            sidebarOpen: false
        }
    },
    getInitialState: function(){
        return {
            commentLimit: 200,
            comments: [],
            additionalComments: [],
            page: 0,
            lastFetchCount: null,
            loading: true,
        }
    },
    getNextPage(){
        var self = this;
        var currentPage = this.state.page;
        var nextPage = currentPage + 1;
        var additionalComments = this.state.additionalComments
        var query = new Parse.Query("DealComment")
        query.include("author")
        query.equalTo( "deal", Pointer(this.props.deal.objectId) )
        query.descending("createdAt")
        query.skip( this.state.commentLimit * nextPage )
        query.limit( this.state.commentLimit );

        query.find()
        .then( function(results){
            results.forEach( function(comment){
                additionalComments.push( comment.toJSON() )
            })
            if ( results.length == 0)
            {
                nextPage = currentPage
            }
            self.setState( {additionalComments: additionalComments, page: nextPage, lastFetchCount: results.length} )
        }).catch(error => console.error(error));
    },
    componentWillMount(){
        const {deal} = this.props;
        let dealId = deal.objectId
        this.props.loadData(dealId);
    },
    componentDidMount() {
        //doing this so that iOS records the scrollTop position correctly.
        var messageContainer = this.refs.messagesContainer;
        if (!messageContainer) return
        messageContainer.ontouchstart = function () {
            // console.log("touchstart scrollTop " + messageContainer.scrollTop )
        };

        messageContainer.onscroll = function(){
            // console.log("onscroll scrollTop " + messageContainer.scrollTop )
        }
    },
    componentWillUpdate: function(nextProps, nextState) {
        var node = this.refs.messagesContainer;
        if (!node) return
        var buffer = 50;
        var currentPosition = node.scrollTop + node.offsetHeight;
        this.shouldScrollBottom = currentPosition + buffer >= node.scrollHeight;
        //TODO: record width changes and scale the scroll position accordingly
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    },
    componentDidUpdate: function(prevProps, prevState) {
        var node = this.refs.messagesContainer;
        if (!node) return
        if (this.shouldScrollBottom || this.scrollTop === 0) {
            this.scrollBottom();
        }
        else {
            var newPosition =this.scrollTop + (node.scrollHeight - this.scrollHeight);
            node.scrollTop = newPosition;
        }
    },
    scrollBottom(){
        var node = this.refs.messagesContainer;
        if (!node) return
        node.scrollTop = node.scrollHeight;
        //Note: doing this so that mobile works a bit better
        setTimeout(function(){
            node.scrollTop = node.scrollHeight;
        }, 200);
    },
    scrollBottomIfNeeded(height){
        var node = this.refs.messagesContainer;
        if (!node) return
        var buffer = 25;
        var currentPosition = node.scrollTop + node.offsetHeight;
        var shouldScrollBottom = currentPosition + buffer >= node.scrollHeight;
        if (shouldScrollBottom) {
            this.scrollBottom();
        }
    },
    forceShowUsername: function( currentDate, previousDate )
    {
        if ( currentDate != null & !(currentDate instanceof Date) ){
            currentDate = new Date(currentDate);
        }
        if ( previousDate != null && !(previousDate instanceof Date) )
        {
            previousDate = new Date(previousDate)
        }

        var isSameDate = RoostUtil.isSameDate( currentDate, previousDate );
        var elapsedMinutes = ( currentDate.getTime() - ( previousDate != null ? previousDate.getTime() : 0) ) / 1000 / 60;
        return !isSameDate || elapsedMinutes > 30;
    },
    render: function(){
        const component = this;
        const {deal} = this.props;
        const {comments, commentLimit, lastFetchCount, additionalComments} = this.props;
        var commentsSection = null;
        if (this.props.isLoading)
        {
            commentsSection =
            <div className="loadingComments lead">
                <i className="fa fa-spinner fa-spin"></i>
                &nbsp; Loading Comments...
            </div>;
        }
        else if ( this.props.comments.length == 0 )
        {
            commentsSection =
            <div className="emptyComments lead">
                There are no comments yet, add one below to get started!
            </div>;
        }
        else
        {
            var allComments = comments.slice(0).concat(additionalComments);
            allComments = allComments.reverse();
            var items = [];
            var previousComment = null;
            allComments.forEach(function(comment){
                var currentDate = comment.createdAt
                var previousDate = previousComment != null ? previousComment.createdAt : null;
                var isSameDate = RoostUtil.isSameDate( currentDate, previousDate );

                if ( !isSameDate || previousComment == null )
                {
                    var separator =
                    <CommentDateSeparator
                        key={"dateSeparator_comment_" + comment.objectId }
                        previousDate={previousDate}
                        nextDate={comment.createdAt}
                        />
                    items.push( separator );
                }

                var forceShowUsername = component.forceShowUsername(currentDate, previousDate);
                var item =
                <CommentItem key={"commentItem_" + comment.objectId}
                    comment={comment}
                    previousComment={previousComment}
                    forceShowUsername={forceShowUsername}
                    />;
                items.push(item);
                previousComment = comment;
            })
            commentsSection =
            <ul className="list-unstyled commentsList" id="commentsList" ref="commentList">
                {items.map(function(item){
                    return item;
                })}
            </ul>;
        }

        var moreButton = null
        if ( lastFetchCount == null && comments.length === commentLimit || lastFetchCount === commentLimit )
        {
            moreButton = <button className="btn btn-outline-primary loadMore" onClick={this.getNextPage}>Load Previous Comments</button>
        }
        else if ( lastFetchCount != null && lastFetchCount < commentLimit ){
             moreButton = <div className="messageStart">This is the start of the message history</div>
        }

        var result =
        <div className={"commentsSection container-fluid"}>
            <div className="messagesContainer" ref="messagesContainer">
                {moreButton}
                {commentsSection}
            </div>
            <AddComment
                ref="addComment"
                deal={deal}
                onHeightChange={this.scrollBottomIfNeeded}>
            </AddComment>
        </div>

        return result;
    }
});

const mapStateToProps = (immutableState, ownProps) => {
    const state = Map(immutableState).toJS()
    const {entities, roosts} = state
    const deal = ownProps.deal;
    const dealId = deal.objectId

    if (!roosts[dealId]){
        return {isLoading: true};
    }
    const roost = roosts[dealId]
    const {isLoading} = roost;
    const {ids, commentLimit, lastFetchCount} = roost.comments
    const comments = denormalize(ids, [Comment.Schema], entities)
    const additionalComments = []

    return Map({
        isLoading,
        dealId,
        comments,
        additionalComments,
        commentLimit,
        lastFetchCount
    }).toJS()
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadData: (dealId) => {
            dispatch(loadComments(dealId))
            dispatch(subscribeComments(dealId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
