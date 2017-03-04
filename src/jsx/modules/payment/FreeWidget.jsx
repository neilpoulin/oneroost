import React from "react"
import PlanWidget from "PlanWidget"
import {FREE as Plan} from "plans"

const FreeWidget = React.createClass({
    render () {
        return <PlanWidget
            name={Plan.name}
            features={Plan.features}
            price={Plan.price}
            period={Plan.duration}
            panelType="warning"/>
    }
})

export default FreeWidget
