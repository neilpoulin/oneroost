import React from 'react';
import { findDOMNode } from 'react-dom';
import BootstrapButton from './BootstrapButton';
import $ from 'jquery';
global.jQuery = require('jquery');
require('bootstrap');

export default React.createClass({
    // The following two methods are the only places we need to
    // integrate Bootstrap or jQuery with the components lifecycle methods.
    componentDidMount: function() {
        // When the component is added, turn it into a modal
        $(findDOMNode(this))
        .modal({backdrop: 'static', keyboard: false, show: false});
    },
    componentWillUnmount: function() {
        $(findDOMNode(this)).off('hidden', this.handleHidden);
    },
    close: function() {
        $(findDOMNode(this)).modal('hide');
    },
    open: function() {
        $(findDOMNode(this)).modal('show');
    },
    render: function() {
        var confirmButton = null;
        var cancelButton = null;

        if (this.props.confirm) {
            confirmButton = (
                <BootstrapButton
                    onClick={this.handleConfirm}
                    className="btn-primary">
                    {this.props.confirm}
                </BootstrapButton>
            );
        }
        if (this.props.cancel) {
            cancelButton = (
                <BootstrapButton onClick={this.handleCancel} className="btn-default">
                    {this.props.cancel}
                </BootstrapButton>
            );
        }

        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close"
                                onClick={this.handleCancel}>
                                &times;
                            </button>
                            <h3>{this.props.title}</h3>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            {cancelButton}
                            {confirmButton}
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    handleCancel: function() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },
    handleConfirm: function() {
        if (this.props.onConfirm) {
            this.props.onConfirm();
        }
    }
});
