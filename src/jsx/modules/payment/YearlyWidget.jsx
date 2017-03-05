import React, {PropTypes} from "react"
import PlanWidget, {BEST_VALUE} from "PlanWidget"
import {YEARLY_USER as Plan} from "plans"

const YearlyWidget = React.createClass({
    propTypes: {
        showSignUp: PropTypes.bool,
    },
    render () {
        return <PlanWidget
            name={Plan.name}
            features={Plan.features}
            price={Plan.price}
            period={Plan.period}
            panelType="success"
            showCornerFlash={true}
            cornerFlashType={BEST_VALUE}
            freeTrial={Plan.freeTrial}
            stripePlanId={Plan.stripePlanId}
            />
    }
})

export default YearlyWidget
