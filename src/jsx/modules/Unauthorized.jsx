import React from "react"

const Unauthorized = React.createClass({
    render () {
        var result =
        <div className="container">
            <div className="col-md-10 col-md-offset-1">
                <div className="row text-center">
                    Sorry, you do not have permission to view the requested page.
                </div>
            </div>
        </div>
        return result
    }
})

export default Unauthorized
