import React, { PropTypes } from "react"
import { Link } from "react-router"

const FixedSidebar = React.createClass({
    propTypes: {
        children: PropTypes.shape({
            props: PropTypes.shape({
                params: PropTypes.any.isRequired,
                deal: PropTypes.object.isRequired
            })
        }),
        columns: PropTypes.number.isRequired
    },
    render () {
        var sidebar =
        <div className={"FixedSidebar container-fluid col-xs-12 col-md-" + this.props.columns}>
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
