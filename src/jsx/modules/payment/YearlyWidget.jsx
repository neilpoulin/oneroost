import React, { PropTypes } from "react"
import PlanWidget, {BEST_VALUE} from "PlanWidget"


const features = ["Yearly 1", "yearly 2"]
const planName = "Yearly"

const YearlyWidget = React.createClass({
    render () {
        return <PlanWidget
            name={planName}
            features={features}
            price={150}
            period="year"
            panelType="success"
            showCornerFlash={true}
            cornerFlashType={BEST_VALUE}
            showFreeTrial={true}/>
    }
})

export default YearlyWidget
