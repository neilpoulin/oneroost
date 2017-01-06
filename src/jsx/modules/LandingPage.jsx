import React, { PropTypes } from "react"
import { withRouter } from "react-router"
import RoostNav from "RoostNav"

const LandingPage = withRouter( React.createClass({
    PropTypes: {
        location: PropTypes.object.isRequired
    },
    componentDidMount(){
        document.title = "OneRoost"
    },
    render () {
        var page =
        <div className={"LandingPage "} >
            <RoostNav showLogin={true} showRegister={true} showHome={false}/>
            <div className="container">
                <h1 className="logo cursive">
                    OneRoost
                </h1>
                <div className="lead text-center">
                    Denver, Colorado
                </div>
            </div>
        </div>
        return page;
    }
}) )

export default LandingPage
