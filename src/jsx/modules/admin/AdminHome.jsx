import React from "react"
import NavLink from "NavLink"

const AdminHome = React.createClass({
    componentDidMount(){
        document.title = "Admin | OneRoost"
    },
    render () {
        var adminHome =
        <div className="container">
            <h1>OneRoost Admin</h1>
            <aside className="adminNav">
                <ul className="list-group">
                    <NavLink tag="li" className="list-group-item" to="/admin/emails">Email Templates</NavLink>
                    <li className="list-group-item"><a href="/admin/dashboard">Parse Dashboard</a></li>
                </ul>
            </aside>

        </div>
        return adminHome
    }
})

export default AdminHome
