import React, { PropTypes } from "react"
import NavLink from "./../NavLink"


const PublicProfileLink = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired,
        tag: PropTypes.string
    },
    getDefaultProps(){
        return {
            tag: "a"
        }
    },
    render () {
        return <NavLink to={"/profile/" + this.props.userId } tag={this.props.tag}>{this.props.children}</NavLink>
    }
})

export default PublicProfileLink
