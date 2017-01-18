// import { createAction } from "redux-actions";
import DealComment from "models/DealComment";
import {Map, List} from "immutable"

export const ADD_COMMENT = "ADD_COMMENT"
export const COMMENTS_LOAD_REQUEST = "COMMENTS_LOAD_REQUEST"
export const COMMENTS_LOAD_ERROR = "COMMENTS_LOAD_ERROR"
export const COMMENTS_LOAD_SUCCESS = "COMMENTS_LOAD_SUCCESS"
// import { normalize, schema } from "normalizr"

// Reducer
const initialState = Map({
    isLoading: false,
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
            state.set("ids", List(action.payoad.map(comment => comment.objectId)))
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
