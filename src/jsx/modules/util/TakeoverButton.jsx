import React, { PropTypes } from "react"
import Takeover from "Takeover"

const TakeoverButton = React.createClass({
    propTypes: {
        buttonText: PropTypes.string,
        buttonClass: PropTypes.string,
        buttonType: PropTypes.oneOf(["btn", "span"]),
        disabled: PropTypes.bool,
        buttonIcon: PropTypes.string,
        containerClass: PropTypes.string,
        onSave: PropTypes.func,
        onCancel: PropTypes.func,
        cancelButtonText: PropTypes.string,
        saveButtonText: PropTypes.string,
        cancelButtonType: PropTypes.oneOf(["span", "btn"]),
        cancelButtonClassName: PropTypes.string,
        saveButtonClassName: PropTypes.string,
        showSave: PropTypes.bool,
        showCancel: PropTypes.bool,
        actionLocation: PropTypes.oneOf(["top", "bottom"]),
        title: PropTypes.string
    },
    getInitialState(){
        return {
            open: this.props.open,
        }
    },
    getButtonIcon(){
        var buttonIcon = null;
        if ( this.props.buttonIcon )
        {
            buttonIcon = <i className={"fa fa-" + this.props.buttonIcon}></i>;
        }
        return buttonIcon;
    },
    getDefaultProps(){
        return {
            buttonText: "Open",
            buttonClass: "btn-primary",
            buttonType: "btn",
            open: false,
            disabled: false,
            buttonIcon: "",
            containerClass: "",
            onSave: function(val){ console.warn("No onSave function passed to TakeoverButton for value ", val)},
            onCancel: function(){},
            cancelType: "close",
            cancelButtonText: "Cancel",
            saveButtonText: "Done",
            cancelButtonClassName: "btn-outline-secondary",
            saveButtonClassName: "btn-primary",
            showSave: false,
            showCancel: true,
            actionLocation: "bottom",
            title: null
        }
    },
    openTakeover(){
        this.refs.takeover.openTakeover();
    },
    closeTakeover(){
        this.refs.takeover.closeTakeover();
    },
    render () {
        let inlineClass = this.props.buttonType === "span" ? "inline-block" : "";
        let button =
        <div className={"TakeoverButton " + this.props.containerClass + " " + inlineClass} >
            <span className={`${this.props.buttonType} ${this.props.buttonClass}`}
                onClick={this.openTakeover}
                disabled={this.props.disabled}
                >
                {this.getButtonIcon()}&nbsp;{this.props.buttonText}
            </span>
            <Takeover ref="takeover"
                ref="takeover"
                open={this.state.open}
                onSave={this.props.onSave}
                onCancel={this.props.onCancel}
                showCancel={this.props.showCancel}
                showSave={this.props.showSave}
                saveButtonText={this.props.saveButtonText}
                cancelButtonText={this.props.cancelButtonText}
                cancelButtonType={this.props.cancelButtonType}
                cancelButtonClassName={this.props.cancelButtonClassName}
                saveButtonClassName={this.props.saveButtonClassName}
                actionLocation={this.props.actionLocation}
                title={this.props.title}
            >
                {this.props.children}
            </Takeover>
        </div>

        return button;
    }
})

export default TakeoverButton
