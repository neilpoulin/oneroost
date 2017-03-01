import React, { PropTypes } from "react"
import PlanWidget from "PlanWidget"

const planName = "Free"
const features = ["Free 1", "Free 2", "Free 3", "free 4 free 4 free 4free 4 free 4 free 4 free 4 free 4"]
const FreeWidget = React.createClass({
    render () {
        return <PlanWidget name={planName} features={features} price={0} panelType="warning"/>
    }
})

export default FreeWidget
