'use strict';

define(['react', 'LoginComponent'], function (React, LoginComponent) {
  return React.createClass({
    handleLoginSuccess: function handleLoginSuccess() {
      document.location = "/my/home";
    },
    render: function render() {
      return React.createElement(
        'div',
        { className: 'container ' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'page-header' },
            React.createElement(
              'h1',
              { className: 'text-center' },
              'Welcome to One Roost'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { className: 'container ' },
            React.createElement(
              'div',
              { className: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3' },
              React.createElement(LoginComponent, { success: this.handleLoginSuccess })
            )
          )
        )
      );
    }
  });
});