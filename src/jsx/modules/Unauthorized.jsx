import React from "react"
import RoostNav from "RoostNav"
import Logo from "Logo"

const Unauthorized = React.createClass({
    render () {
        var result =
        <div>
            <RoostNav/>
            <div className="container">
                <Logo className="header"/>
                <div className="col-md-10 col-md-offset-1">
                    <div className="row text-center">
                        Sorry, you do not have permission to view the requested page.
                    </div>
                </div>
            </div>
        </div>

        return result
    }
})

export default Unauthorized
