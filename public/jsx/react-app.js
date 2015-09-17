'use strict';

// Simple pure-React component so we don't have to remember
// Bootstrap's classes

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var BootstrapButton = React.createClass({
  displayName: "BootstrapButton",

  getInitialState: function getInitialState() {
    return {
      counter: 0
    };
  },
  render: function render() {
    return React.createElement("a", _extends({}, this.props, {
      href: "javascript:;",
      role: "button",
      className: (this.props.className || '') + ' btn' }));
  }
});

var BootstrapModal = React.createClass({
  displayName: "BootstrapModal",

  // The following two methods are the only places we need to
  // integrate Bootstrap or jQuery with the components lifecycle methods.
  componentDidMount: function componentDidMount() {
    // When the component is added, turn it into a modal
    $(React.findDOMNode(this)).modal({ backdrop: 'static', keyboard: false, show: false });
  },
  componentWillUnmount: function componentWillUnmount() {
    $(React.findDOMNode(this)).off('hidden', this.handleHidden);
  },
  close: function close() {
    $(React.findDOMNode(this)).modal('hide');
  },
  open: function open() {
    $(React.findDOMNode(this)).modal('show');
  },
  render: function render() {
    var confirmButton = null;
    var cancelButton = null;

    if (this.props.confirm) {
      confirmButton = React.createElement(
        BootstrapButton,
        {
          onClick: this.handleConfirm,
          className: "btn-primary" },
        this.props.confirm
      );
    }
    if (this.props.cancel) {
      cancelButton = React.createElement(
        BootstrapButton,
        { onClick: this.handleCancel, className: "btn-default" },
        this.props.cancel
      );
    }

    return React.createElement(
      "div",
      { className: "modal fade" },
      React.createElement(
        "div",
        { className: "modal-dialog" },
        React.createElement(
          "div",
          { className: "modal-content" },
          React.createElement(
            "div",
            { className: "modal-header" },
            React.createElement(
              "button",
              {
                type: "button",
                className: "close",
                onClick: this.handleCancel },
              "×"
            ),
            React.createElement(
              "h3",
              null,
              this.props.title
            )
          ),
          React.createElement(
            "div",
            { className: "modal-body" },
            this.props.children
          ),
          React.createElement(
            "div",
            { className: "modal-footer" },
            cancelButton,
            confirmButton
          )
        )
      )
    );
  },
  handleCancel: function handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function handleConfirm() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }
});

var CounterWell = React.createClass({
  displayName: "CounterWell",

  render: function render() {
    return React.createElement(
      "span",
      {
        className: "label label-default" },
      "Count: ",
      this.props.count
    );
  }
});

var UserProfileCard = React.createClass({
  displayName: "UserProfileCard",

  mixins: [ParseReact.Mixin],
  getInitialState: function getInitialState() {
    var module = this;
    var result = new Parse.Query(Parse.User).ascending('createdAt').limit(10).find({
      success: function success(resp) {
        console.log("success!");
        console.log(resp);
        // module.data.users = resp;
        module.setState({ "users": resp });
      },
      error: function error(resp) {
        console.log("somethign went wrong");
      }
    });

    return {
      users: [],
      username: "Unknown Username",
      id: "0"
    };
  },
  observe: function observe() {
    console.log("observing");
    return {
      users: new Parse.Query(Parse.User).ascending('createdAt').limit(10)
    };
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "container" },
      this.data.users.map(function (user) {
        return React.createElement(
          "div",
          { className: "col-md-3 profileCard" },
          React.createElement(
            "h3",
            null,
            user.username
          ),
          React.createElement(
            "div",
            null,
            "UserId: ",
            user.id
          )
        );
      })
    );
  }
});

var Example = React.createClass({
  displayName: "Example",

  handleCancel: function handleCancel() {
    if (confirm('Are you sure you want to cancel?')) {
      this.refs.modal.close();
    }
  },
  getInitialState: function getInitialState() {
    return {
      counter: 0
    };
  },
  render: function render() {
    var modal = null;
    modal = React.createElement(
      BootstrapModal,
      {
        ref: "modal",
        confirm: "Done",
        cancel: "Cancel",
        onCancel: this.handleCancel,
        onConfirm: this.closeModal,
        title: "Hello, Bootstrap!" },
      "This is a React component powered by jQuery and Bootstrap!"
    );

    var counterWell = React.createElement(CounterWell, {
      count: this.state.counter });

    var profiles = React.createElement(UserProfileCard, { ref: "profiles" });

    return React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "h1",
        null,
        "Next Steps - React"
      ),
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "example col-md-6 " },
          modal,
          React.createElement(
            BootstrapButton,
            { onClick: this.openModal, className: "btn-primary" },
            "Open Popup"
          ),
          counterWell
        )
      ),
      React.createElement(
        "div",
        { className: "row" },
        profiles
      )
    );
  },
  openModal: function openModal() {
    this.refs.modal.open();
    this.setState({
      counter: this.state.counter + 1
    });
  },
  closeModal: function closeModal() {
    this.refs.modal.close();
    this.refs.profiles.refreshQueries();
  }
});

Parse.$ = jQuery;
Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu", "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");

React.render(React.createElement(Example, null), document.getElementById('jqueryexample'));