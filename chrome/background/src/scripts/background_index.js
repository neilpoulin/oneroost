import {wrapStore} from "react-chrome-redux"
import store from "store/configureStore"
import Parse from "parse"
import axios from "axios"
import {loadCachedUser} from "ducks/user"

const oneroostDomain = "https://dev.oneroost.com"

wrapStore(store, {
    portName: "oneroost"
})

axios.get(`${oneroostDomain}/config`).then(({data}) => {
    console.log(data)
    Parse.initialize(data.applicationId);
    Parse.serverURL = `${oneroostDomain}/parse`;
    store.dispatch(loadCachedUser())
})
