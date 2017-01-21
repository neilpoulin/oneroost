// import { createAction } from "redux-actions";
import DealComment, {createQuery, Schema} from "models/DealComment";
import {Pointer as DealPointer} from "models/Deal"
import {Map, List} from "immutable"
import {normalize} from "normalizr"

export const ADD_COMMENT = "ADD_COMMENT"
export const COMMENTS_LOAD_REQUEST = "COMMENTS_LOAD_REQUEST"
export const COMMENTS_LOAD_ERROR = "COMMENTS_LOAD_ERROR"
export const COMMENTS_LOAD_SUCCESS = "COMMENTS_LOAD_SUCCESS"
// import { normalize, schema } from "normalizr"
const pageSize = 200
// Reducer
export const initialState = Map({
    isLoading: false,
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
            state = state.set("ids", state.get("ids").push(id))
            break;
        case COMMENTS_LOAD_REQUEST:
            state = state.set("isLoading", false)
            break;
        case COMMENTS_LOAD_SUCCESS:
            state = state.set("isLoading", false)
            state = state.set("ids", List(action.payload.map(comment => comment.objectId)))
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

export const loadComments = function(dealId){
    return (dispatch) =>{
        dispatch({
            type: COMMENTS_LOAD_REQUEST,
            dealId: dealId
        });
        const query = createQuery()
        query.include("author")
        query.equalTo( "deal", DealPointer(dealId) )
        query.descending("createdAt")
        query.limit( pageSize )
        query.find().then(results => {
            let comments = results.map(comment => comment.toJSON())
            dispatch({
                type: COMMENTS_LOAD_SUCCESS,
                dealId: dealId,
                payload: comments,
                entities: normalize(comments, [Schema]).entities
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

export const addComment = function(comment){
    return {
        type: ADD_COMMENT,
        dealId: comment.get("deal").id || comment.get("deal").get("objectId"),
        payload: comment
    }
}

exports.createComment = function(message){
    return (dispatch) => {
        let comment = new DealComment();
        comment.set(message);
        comment.save().then(saved => {
            dispatch(addComment(Map(saved.toJSON())));
        })
    }
}
