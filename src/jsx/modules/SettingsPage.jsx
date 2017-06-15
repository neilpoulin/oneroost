import React from "react"
import RoostNav from "RoostNav"
import SidebarNav from "SidebarNav"

const navLinks = [
    {
        path: "/settings/profile",
        displayText: "My Profile"
    },
    {
        path: "/settings/company",
        displayText: "Company"
    },
    {
        path: "/settings/brand-page",
        displayText: "Brand Page"
    }
]

const SettingsPage = React.createClass({
    render () {
        return (
            <div className="SettingsPage left-nav-page">
                <RoostNav showHome={true}/>
                <div className="page-body">
                    <div className="content">
                        {this.props.children}
                    </div>
                    <nav className="left-nav hidden-xs">
                        <SidebarNav links={navLinks}/>
                    </nav>
                </div>
            </div>
        )
    }
})

export default SettingsPage
