import React from "react"
import PropTypes from "prop-types"

const DealDashboard = React.createClass({
    propTypes: {
        children: PropTypes.object.isRequired
    },
    componentDidMount(){
        document.title= "My Opportunities | OneRoost"
    },
    render () {
        var dashboard =
        <div className="DealDashboard">
            {this.props.children}
        </div>

        return dashboard;
    }
})

export default DealDashboard
