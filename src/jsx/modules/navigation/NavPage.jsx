import React, { PropTypes } from "react"
import RoostNav from "RoostNav"
const NavPage = React.createClass({
    propTypes: {
        showHome: PropTypes.bool
    },
    getDefaultProps(){
        return {
            showHome: true
        }
    },
    render () {
        return <div>
            <RoostNav showHome={this.props.showHome}/>
            {this.props.children}
        </div>
    }
})

export default NavPage
