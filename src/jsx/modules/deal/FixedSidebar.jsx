import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router"

const FixedSidebar = React.createClass({
    propTypes: {
        children: PropTypes.shape({
            props: PropTypes.shape({
                params: PropTypes.any.isRequired,
                deal: PropTypes.object.isRequired
            })
        })
    },
    render () {
        var sidebar =
        <div className={"FixedSidebar"}>
            <div className="close">
                <Link to={"/roosts/" + this.props.children.props.params.dealId}
                    className="" >
                    <i className="fa fa-times fa-lg"></i>
                </Link>
            </div>
            {this.props.children}
        </div>;
        return sidebar;
    }
})

export default FixedSidebar
