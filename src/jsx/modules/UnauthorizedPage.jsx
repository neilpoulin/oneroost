import React from "react"
import RoostNav from "./navigation/RoostNav";

const UnauthorizedPage = React.createClass({
    render () {
        return (
            <div>
                <RoostNav showHome={false}/>
                <div className="UnauthorizedPage ErrorPage container">
                    <p className="lead">
                        You do not have permissions to view this page.
                    </p>
                </div>
            </div>
        )
    }
})

export default UnauthorizedPage
