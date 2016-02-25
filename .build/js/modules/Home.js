'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _LoginComponent = require('./LoginComponent');

var _LoginComponent2 = _interopRequireDefault(_LoginComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'Home',

  handleLoginSuccess: function handleLoginSuccess() {
    document.location = "/my/home";
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'container ' },
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'page-header' },
          _react2.default.createElement(
            'h1',
            { className: 'text-center' },
            'Welcome to One Roost'
          )
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
          'div',
          { className: 'container ' },
          _react2.default.createElement(
            'div',
            { className: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3' },
            _react2.default.createElement(_LoginComponent2.default, { success: this.handleLoginSuccess })
          )
        )
      )
    );
  }
});