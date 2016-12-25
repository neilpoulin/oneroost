import React, { PropTypes } from "react"
import Modal from "react-modal"

const Takeover = React.createClass({
    propTypes: {
        children: PropTypes.object,
        showSave: PropTypes.bool,
        showCancel: PropTypes.bool,
        onSave: PropTypes.func,
        onCancel: PropTypes.func,
        saveButtonText: PropTypes.string,
        cancelButtonText: PropTypes.string,
        actionLocation: React.PropTypes.oneOf(["top", "bottom"]),
        cancelButtonType: React.PropTypes.oneOf(["span", "btn"]),
        cancelButtonClassName: PropTypes.string,
        saveButtonClassName: PropTypes.string,
        title: PropTypes.string
    },
    getDefaultProps(){
        return {
            open: false,
            onSave: function(){console.warn("No onSave function passed to Takeover")},
            onCancel: function(){},
            saveButtonText: "Save",
            cancelButtonText: "Cancel",
            actionLocation: "top",
            showSave: false,
            showCancel: true,
            cancelButtonType: "span",
            cancelButtonClassName: "btn-outline-secondary",
            saveButtonClassName: "btn-primary",
            title: null
        }
    },
    getInitialState(){
        return {
            open: this.props.open
        }
    },
    closeTakeover(){
        this.setState({open: false});
    },
    handleCancel(){
        this.props.onCancel();
        this.closeTakeover();
    },
    handleSave(){
        this.props.onSave();
        this.closeTakeover();
    },
    openTakeover(){
        this.setState({open: true});
    },
    afterOpen(){

    },
    render () {
        let save = null;
        if ( this.props.showSave ){
            save =
            <button className={`btn ${this.props.saveButtonClassName}`}
                onClick={this.handleSave}>
                {this.props.saveButtonText}
            </button>
        }
        let cancel = null;
        if ( this.props.showCancel ){
            cancel =
            <span className={`${this.props.cancelButtonType} ${this.props.cancelButtonClassName}`}
                onClick={this.handleCancel}>
                {this.props.cancelButtonText}
            </span>
        }

        let title = null
        if ( this.props.title ){
            title = <h3 className="title">{this.props.title}</h3>
        }
        let takeover =
        <Modal
          isOpen={this.state.open}
          onAfterOpen={this.afterOpen}
          onRequestClose={this.props.closeTakeover}
          contentLabel="Modal"
          className={"TakeoverModal"}
          overlayClassName="TakeoverOverlay"
        >
            {title}
            <div className={`ordered actions-${this.props.actionLocation}`}>
                <div className="actions">
                    {cancel}
                    {save}
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>


        </Modal>

        return takeover;
    }
})

export default Takeover
