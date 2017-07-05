import {fromJS} from "immutable"

const initialState = {

}

export default function reducer(state=initialState, action){
    state = fromJS(state)

    return state.toJS()
}
