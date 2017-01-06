import React from "react"
import FAQ from "help/FAQ"
import RoostNav from "RoostNav"
import TermsOfServiceLink from "TermsOfServiceLink"
import PrivacyPolicyLink from "PrivacyPolicyLink"

const HelpPage = React.createClass({
    componentDidMount(){
        document.title = "Help | OneRoost"
    },
    render () {
        let page =
        <div className="HelpPage container">
            <RoostNav showHome={false}/>
            <section>
                <h3>{"Have a question?"}</h3>
                <p>
                    Shoot an email to <a href="mailto:help@oneroost.com">help@oneroost.com</a>
                </p>
            </section>
            <section>
                <h3>FAQs</h3>
                <FAQ/>
            </section>
            <section>
                <h3>Legal</h3>
                <p>View our <TermsOfServiceLink text="Terms of Service"/></p>
                <p>View our <PrivacyPolicyLink text="Privacy Policy"/></p>
            </section>
        </div>
        return page;
    }
})

export default HelpPage
