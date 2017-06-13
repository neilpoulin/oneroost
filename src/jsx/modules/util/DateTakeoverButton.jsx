import React, { PropTypes } from "react"
import InfiniteCalendar from "react-infinite-calendar"
import TakeoverButton from "TakeoverButton"

const DateTakeoverButton = React.createClass({
    propTypes: {
        onChange: PropTypes.func.isRequired,
        buttonText: PropTypes.string,
        buttonType: PropTypes.oneOf(["btn", "span"]),
        buttonClass: PropTypes.string,
        containerClass: PropTypes.string,
        selectedDate: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.instanceOf(Date)
        ])
    },
    getDefaultProps(){
        return {
            buttonText: "Choose Date",
            buttonClass: "btn-primary",
            buttonType: "btn",
            open: false,
            containerClass: "",
            selectedDate: new Date()
        }
    },
    getInitialState(){
        return {
            open: this.props.open,
            orientation: this.getOrientation(),
            selectedValue: "",
            calendarHeight: this.getCalendarHeight(),
        }
    },
    afterSelect(val){
        this.setState({selectedValue: val});
    },
    doSave(){
        this.props.onChange(this.state.selectedValue);
    },
    componentDidMount(){
        window.addEventListener("orientationchange", this.updateOrientation, false);
        window.addEventListener("resize", this.updateOrientation, false);
    },
    componentWillUnmount(){
        window.removeEventListener("orientationchange", this.updateOrientation);
        window.removeEventListener("resize", this.updateOrientation);
    },
    updateOrientation(){
        this.setState({
            orientation: this.getOrientation(),
            calendarHeight: this.getCalendarHeight()
        });
    },
    getOrientation(){
        if (window.innerHeight > window.innerWidth || window.innerWidth > 768){
            return "portrait"
        }
        return "landscape"
    },
    getCalendarHeight(){
        let offset = 290;
        switch (this.getOrientation()) {
            case "landscape":
                offset = 200
                break;
            default:
                break;
        }

        let height = window.innerHeight - offset;
        return Math.min(height, 350);
    },
    render () {
        let button =
        <TakeoverButton
            buttonText={this.props.buttonText}
            buttonType={this.props.buttonType}
            buttonClass={this.props.buttonClass}
            containerClass={this.props.containerClass + " " + (this.props.buttonType == "span" ? "inline-edit-link" : "")}
            open={this.state.open}
            ref="takeoverButton"
            onSave={this.doSave}
            showSave={true}
            showCancel={true}
            cancelButtonType="btn"
            cancelButtonText="Cancel"
            saveButtonText="Done"
            actionLocation="bottom"
            title="Next Step Due Date"
            >
            <InfiniteCalendar
                key={"date_picker_takeover"}
                selected={this.props.selectedDate}
                minDate={new Date()}
                keyboardSupport={true}
                className="dateTakeover"
                width="100%"
                height={this.state.calendarHeight}
                layout={this.state.orientation}
                shouldHeaderAnimate={true}
                onSelect={this.afterSelect}
                />
        </TakeoverButton>
        return button;
    }
})

export default DateTakeoverButton
