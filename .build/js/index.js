'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _parse = require('parse');

var _parse2 = _interopRequireDefault(_parse);

var _reactRouter = require('react-router');

var _Home = require('./modules/Home');

var _Home2 = _interopRequireDefault(_Home);

var _App = require('./modules/App');

var _App2 = _interopRequireDefault(_App);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_parse2.default.$ = _jquery2.default;
_parse2.default.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

(0, _reactDom.render)(_react2.default.createElement(
    _reactRouter.Router,
    { history: _reactRouter.browserHistory },
    _react2.default.createElement(
        _reactRouter.Route,
        { path: '/', component: _App2.default },
        _react2.default.createElement(_reactRouter.IndexRoute, { component: _Home2.default })
    )
), document.getElementById('app'));