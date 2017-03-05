import React, { PropTypes } from "react"
import PlanWidget from "PlanWidget"
import {MONTHLY_USER as Plan} from "plans"

const MonthlyWidget = React.createClass({
    propTypes:{
        showSignUp: PropTypes.bool,
    },
    render () {
        return <PlanWidget
            name={Plan.name}
            features={Plan.features}
            price={Plan.price}
            period={Plan.period}
            panelType={"info"}
            freeTrial={Plan.freeTrial}
            stripePlanId={Plan.stripePlanId}/>
    }
})

export default MonthlyWidget
