import React, { PropTypes } from "react"
import RoostNav from "RoostNav"
import FreeWidget from "FreeWidget"
import MonthlyWidget from "MonthlyWidget"
import YearlyWidget from "YearlyWidget"

import Logo from "Logo";

const PlansPage = React.createClass({
    propTypes: {

    },
    render () {
        return (
            <div className="PricingPage">
                <RoostNav/>
                <div className="container">
                    <div className="heading">
                        <div>
                            <Logo className="header"/>
                        </div>
                        <p className="lead">
                            {"Choose a plan that's right for you"}
                        </p>
                    </div>
                    <div className="plans">
                        <FreeWidget/>
                        <MonthlyWidget/>
                        <YearlyWidget/>
                    </div>
                </div>
            </div>
        )
    }
})

export default PlansPage;
