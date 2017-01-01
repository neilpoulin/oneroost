import React from "react"

export default React.createClass({
    getInitialState: function(){
        return {
            isVisible: this.props.visible,
            isSpinning: true
        }
    },
    getDefaultProps(){
        return {
            visible: false
        }
    },
    doShow: function(){
        this.setState({"isVisible": true});
        return this.render();
    },
    doHide: function(){
        this.setState({"isVisible": false});
        return this.render();
      },
    render: function(){
        return (
            <i className={"fa fa-spinner " + (this.state.isSpinning ? "fa-spin " : "") + (this.props.visible ? "" : "hidden ")}></i>
        );
    }
});
