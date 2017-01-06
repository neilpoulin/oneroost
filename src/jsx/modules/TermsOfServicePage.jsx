import React from "react"
import TermsOfService from "TermsOfService"
import RoostNav from "RoostNav"
import Logo from "Logo"

const TermsOfServicePage = React.createClass({
    render () {
        let page =
        <div className="TermsOfServicePage">
            <RoostNav showLogin={true} showRegister={true} showHome={false}/>
            <div className="container">
                <Logo className="header"/>
                <h1>Terms Of Service</h1>
                <TermsOfService/>
            </div>
        </div>
        return page;
    }
})

export default TermsOfServicePage
