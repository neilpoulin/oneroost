import React, { PropTypes } from "react"
import PlanWidget from "PlanWidget"

const planName = "Monthly"
const features = ["Feature 1", "Feature 2"]

const MonthlyWidget = React.createClass({
    render () {
        return <PlanWidget name={planName} features={features} price={15} period={"month"} panelType={"info"}/>
    }
})

export default MonthlyWidget
