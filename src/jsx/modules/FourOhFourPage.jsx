import React from "react"
import RoostNav from "./navigation/RoostNav";

const FourOhFourPage = React.createClass({
    render () {
        return (
            <div>
                <RoostNav showHome={false}/>
                <div className="FourOhFourPage container">
                    <p className="lead">
                        Ooops, the page was not found.
                    </p>
                </div>
            </div>
        )
    }
})

export default FourOhFourPage
