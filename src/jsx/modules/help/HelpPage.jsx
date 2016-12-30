import React from "react"
import FAQ from "help/FAQ"
import RoostNav from "RoostNav"

const HelpPage = React.createClass({

    render () {
        let page =
        <div className="HelpPage container">
            <RoostNav/>
            <h3>{"Have a question?"}</h3>
            Shoot an email to <a href="mailto:help@oneroost.com">help@oneroost.com</a>
            <h3>FAQs</h3>
            <FAQ/>
        </div>
        return page;
    }
})

export default HelpPage
