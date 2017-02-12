import * as DealComment from "models/DealComment";
import {Pointer as DealPointer} from "models/Deal"
import {Map, List, fromJS} from "immutable"
import {normalize} from "normalizr"
import {addSubscription, handler} from "ducks/subscriptions"
import * as Notification from "ducks/notification"
import {toJSON} from "RoostUtil"

export const ADD_COMMENT = "oneroost/comments/ADD_COMMENT"
export const COMMENTS_LOAD_REQUEST = "oneroost/comments/COMMENTS_LOAD_REQUEST"
export const COMMENTS_LOAD_ERROR = "oneroost/comments/COMMENTS_LOAD_ERROR"
export const COMMENTS_LOAD_SUCCESS = "oneroost/comments/COMMENTS_LOAD_SUCCESS"
// import { normalize, schema } from "normalizr"
const pageSize = 200
// Reducer
export const initialState = Map({
    isLoading: false,
    hasLoaded: false,
    page: 0,
    lastFetchCount: 0,
    pageSize: pageSize,
    ids: List([])
})

export default function reducer(state=initialState, action){
    switch (action.type) {
        case ADD_COMMENT:
            let {payload} = action;
            let id = payload.get("objectId");
            if ( !state.get("ids").includes(id) ){
                state = state.set("ids", state.get("ids").unshift(id))
            }            
            break;
        case COMMENTS_LOAD_REQUEST:
            state = state.set("isLoading", false)
            break;
        case COMMENTS_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("hasLoaded", true)
            state = state.set("ids", List(action.payload.map(comment => comment.get("objectId"))))
            break;
        case COMMENTS_LOAD_ERROR:
            state = state.set("isLoading", false);
            break;
        default:
            break;
    }
    return state;
}

// Actions
const commentsQuery = (dealId) => {
    const query = DealComment.createQuery()
    query.include("author")
    query.equalTo( "deal", DealPointer(dealId) )
    query.descending("createdAt")
    query.limit( pageSize )
    return query;
}

export const addComment = (comment) => (dispatch, getState) => {
    dispatch({
        type: Notification.COMMENT_ADDED,
        payload: comment,
        dealId: comment.get("deal").get("objectId"),
        dispatcher: dispatch,
    })
    dispatch( {
        type: ADD_COMMENT,
        dealId: comment.get("deal").id || comment.get("deal").get("objectId"),
        payload: comment,
        entities: normalize(toJSON(comment), DealComment.Schema).entities
    })
}


export const subscribeComments = function(dealId){
    console.log("subscribe comments called");
    return (dispatch, getState) => {
        console.log("executing subscribe comments");
        const query = commentsQuery(dealId)
        dispatch(addSubscription("COMMENTS", dealId, query, handler({
            create: (result) => dispatch(addComment(fromJS(result.toJSON()))),
            delete: () => console.log("not implemented")
        }) ))
    }
}

export const loadComments = function(dealId, force=false){
    return (dispatch, getState) =>{
        let {roosts} = getState();
        if ( roosts.has(dealId) && roosts.get(dealId).get("comments").get("hasLoaded") && !roosts.get(dealId).get("comments").get("isLoading") && !force ){
            console.warn("not loading comments as it has been loaded before")
            return null
        }

        dispatch({
            type: COMMENTS_LOAD_REQUEST,
            dealId: dealId,
        });
        const query = commentsQuery(dealId)

        query.find().then(results => {
            let comments = results.map(comment => comment.toJSON())
            dispatch({
                type: COMMENTS_LOAD_SUCCESS,
                dealId: dealId,
                payload: comments,
                entities: normalize(comments, [DealComment.Schema]).entities
            })
        }).catch(error => {
            console.error(error)
            dispatch({
                type: COMMENTS_LOAD_ERROR,
                dealId: dealId,
                error: error
            })
        });
    }
}

exports.createComment = function(message){
    return (dispatch) => {
        let comment = DealComment.fromJS(message)
        comment.save().then(saved => {
            // dispatch(addComment(comment));
        }).catch(error => {
            console.error(error)
        })
    }
}
