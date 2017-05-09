import React, { PropTypes } from "react"
import NavLink from "NavLink"

const SidebarNav = React.createClass({
    propTypes: {
        links: PropTypes.arrayOf(PropTypes.shape({
            path: PropTypes.string.isRquired,
            displayText: PropTypes.string.isRequired,
        })),
        title: PropTypes.string,

    },
    render () {
        const {links} = this.props
        return (
            <div className="SidebarNav">
                <ul className="nav nav-pills nav-stacked" display-if={links}>
                    {links.map((link, i) => <NavLink key={`sidenav_${i}`} role="presentation" tag="li" to={link.path} className="">{link.displayText}</NavLink>)}
                </ul>
            </div>
        )
    }
})

export default SidebarNav
