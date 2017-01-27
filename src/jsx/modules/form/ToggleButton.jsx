import React, { PropTypes } from "react"

const ToggleButton = React.createClass({
    propTypes: {
        active: PropTypes.bool.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.string,
        activeType: PropTypes.string,
        inactiveType: PropTypes.string,
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        block: PropTypes.bool
    },
    getDefaultProps(){
        return{
            active: false,
            label: "",
            activeType: null,
            inactiveType: null,
            type: "primary",
            className: "",
            block: false,
            onClick: (active) => console.log("no function implemented. State = " + active)
        }
    },
    handleClick(){
        return this.props.onClick(!this.props.active)
    },
    render () {
        const {active, label, type, activeType, inactiveType, className, block} = this.props
        let btnType = (active ? activeType : inactiveType) || type
        let btnClass = `btn btn-${btnType} ${className}`
        if ( active ){
            btnClass = btnClass + " active"
        }
        if ( block ){
            btnClass += " btn-block"
        }
        return (
            <button className={btnClass} aria-pressed={active} onClick={this.handleClick}>
                {label}
            </button>
        )
    }
})

export default ToggleButton
