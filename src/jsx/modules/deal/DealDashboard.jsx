import React, { PropTypes } from "react"

const DealDashboard = React.createClass({
    propTypes: {
        children: PropTypes.object.isRequired
    },
    componentDidMount(){
        document.title= "My Opportunities | OneRoost"
    },
    render () {
        var dashboard =
        <div>
            {this.props.children}
        </div>

        return dashboard;
    }
})

export default DealDashboard
