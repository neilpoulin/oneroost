import React from "react"
import PrivacyPolicy from "PrivacyPolicy"
import RoostNav from "RoostNav"
import Logo from "Logo"

const PrivacyPage = React.createClass({
    render () {
        let page =
        <div className="PrivacyPage">
            <RoostNav showLogin={true} showRegister={true} showHome={false}/>
            <div className="container">
                <Logo className="header"/>
                <h1>Privacy Policy</h1>
                <PrivacyPolicy/>
            </div>
        </div>
        return page;
    }
})

export default PrivacyPage
