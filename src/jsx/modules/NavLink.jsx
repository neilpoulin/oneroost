import React, {PropTypes} from "react"
import activeComponent from "navigation/ActiveComponent"

export default React.createClass({
    propTypes: {
        tag: PropTypes.string,
        to: PropTypes.string.isRequired,
        activeClassName: PropTypes.string,
        className: PropTypes.string
    },
    getDefaultProps: function(){
        return {
            tag: "li",
            activeClassName: "active",
            className: null
        }
    },
    render() {
        var ActiveComponent = activeComponent(this.props.tag);
        return <ActiveComponent
            to={this.props.to}
            activeClassName={this.props.activeClassName}
            className={this.props.className}
            >
            {this.props.children}
        </ActiveComponent>
    }
})
