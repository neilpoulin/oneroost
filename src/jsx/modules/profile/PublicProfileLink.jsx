import React, { PropTypes } from "react"
import NavLink from "NavLink"


const PublicProfileLink = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired,
        tag: PropTypes.string
    },
    getDefaultProps(){
        return {
            tag: "span",
            className: ""
        }
    },
    render () {
        let content = this.props.children;
        if ( !content ){
            content = `${window.location.origin}/proposals/${this.props.userId}`
        }

        return <NavLink to={"/proposals/" + this.props.userId } tag={this.props.tag} className={`PublicProfileLink ${this.props.className}`}>{content}</NavLink>
    }
})

export default PublicProfileLink
