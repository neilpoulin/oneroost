import Parse from "parse"
import {fromJS, Iterable} from "immutable"

function immutableParse({ getState }) {
    return (next) => (action) => {
        let returnValue = action
        try{
            if ( action.type.indexOf("oneroost") == -1 ){
                return next(action)
            }
            // Call the next dispatch method in the middleware chain.
            let {payload} = action
            let transformed = payload;
            if( transformed && transformed instanceof Parse.Object ){
                transformed = fromJS(payload.toJSON())
            }
            if ( transformed && !Iterable.isIterable(transformed) ){
                transformed = fromJS(transformed)
            }
            if ( transformed ){
                action.payload = transformed
            }

            returnValue = next(action)
        }
        catch (e){
            console.error(e)
        }
        finally{
            return returnValue
        }
    }
}

export default immutableParse;
