import {Map, fromJS} from "immutable"
// reducers
const initialState = Map({
    comments: Map({}),
    deals: Map({}),
    nextSteps: Map({}),
    users: Map({}),
    accounts: Map({}),
    documents: Map({}),
    stakeholders: Map({}),
});

// Updates an entity cache in response to any action with response.entities.
const entities = (state = initialState, action) => {
    if ( !action.entities ){
        return state;
    }
    let entities = action.entities;
    if ( !Map.isMap(entities) ){
        entities = fromJS(entities)
    }else {
        entities = fromJS(entities.toJS())
    }
    state = state.mergeDeep(entities)
    return state;
}
export default entities;
