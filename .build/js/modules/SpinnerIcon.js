"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: "SpinnerIcon",

  getInitialState: function getInitialState() {
    return {
      isVisible: false,
      isSpinning: true
    };
  },
  doShow: function doShow() {
    this.setState({ "isVisible": true });
    return this.render();
  },
  doHide: function doHide() {
    this.setState({ "isVisible": false });
    return this.render();
  },
  render: function render() {
    return _react2.default.createElement("i", { className: 'fa fa-spinner ' + (this.state.isSpinning ? 'fa-spin ' : '') + (this.state.isVisible ? '' : 'hidden ') });
  }
});