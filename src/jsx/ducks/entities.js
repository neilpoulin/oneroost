import merge from "lodash/merge"
// reducers
const initialState = {
    comments: {},
    deals: {},
    nextSteps: {},
    users: {},
    accounts: {},
    documents: {},
    stakeholders: {},
};

// Updates an entity cache in response to any action with response.entities.
const entities = (state = initialState, action) => {
    let entities = action.entities || initialState
    return merge({}, state, entities)
}
export default entities;
