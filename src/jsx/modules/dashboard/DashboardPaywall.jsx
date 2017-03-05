import React from "react"
import PlansPage from "PlansPage"

const DashboardPaywall = React.createClass({
    render () {
        return (
            <PlansPage message={"To access this feature, please select a paid plan below."} showSignUp={true}/>
        )
    }
})

export default DashboardPaywall
