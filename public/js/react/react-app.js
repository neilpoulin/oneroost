'use strict';

// Simple pure-React component so we don't have to remember
// Bootstrap's classes
var BootstrapButton = React.createClass({
  getInitialState: function(){
    return {
      counter: 0
    }
  },
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
        );
      }
});

var BootstrapModal = React.createClass({
  // The following two methods are the only places we need to
  // integrate Bootstrap or jQuery with the components lifecycle methods.
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(React.findDOMNode(this))
      .modal({backdrop: 'static', keyboard: false, show: false});
  },
  componentWillUnmount: function() {
    $(React.findDOMNode(this)).off('hidden', this.handleHidden);
  },
  close: function() {
    $(React.findDOMNode(this)).modal('hide');
  },
  open: function() {
    $(React.findDOMNode(this)).modal('show');
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

var CounterWell = React.createClass({
  render: function(){
    return (
      <span
        className="label label-default" >Count: {this.props.count}</span>

    );
  }
});

var UserProfileCard = React.createClass({
  mixins: [ParseReact.Mixin],
  getInitialState: function(){
    var module = this;
    var result = (new Parse.Query(Parse.User)).ascending('createdAt').limit(10).find({
      success: function(resp){
        console.log("success!");
        console.log(resp);
        // module.data.users = resp;
        module.setState({"users": resp});
      },
      error: function(resp){
        console.log("somethign went wrong");
      }
    });

    return {
      users: [],
      username: "Unknown Username",
      id: "0"
    }
  },
  observe: function(){
    console.log("observing");
    return {
      users: (new Parse.Query(Parse.User)).ascending('createdAt').limit(10)
    }
  },
  render: function(){
    return (
        <div className="container">
          {this.data.users.map(function(user){
            return <div className="col-md-3 profileCard">
              <h3>{user.username}</h3>
              <div>UserId: {user.id}</div>
            </div>
          })}
        </div>
    )
  }
});

var Example = React.createClass({
  handleCancel: function() {
    if (confirm('Are you sure you want to cancel?')) {
      this.refs.modal.close();
    }
  },
  getInitialState: function(){
    return{
      counter: 0
    }
  },
  render: function() {
    var modal = null;
    modal = (
      <BootstrapModal
              ref="modal"
              confirm="Done"
              cancel="Cancel"
              onCancel={this.handleCancel}
              onConfirm={this.closeModal}
              title="Hello, Bootstrap!">
          This is a React component powered by jQuery and Bootstrap!
      </BootstrapModal>
    );

    var counterWell = (
      <CounterWell
        count={this.state.counter}>
      </CounterWell>
    );

    var profiles = ( <UserProfileCard ref="profiles"></UserProfileCard> )

    return (
      <div className="container">
        <h1>Next Steps - React</h1>
        <div className="row">
          <div className="example col-md-6 ">
              {modal}
              <BootstrapButton onClick={this.openModal} className="btn-primary">
                  Open Popup
              </BootstrapButton>

              {counterWell}
          </div>
        </div>
        <div className="row">
          {profiles}
        </div>
      </div>
    );
  },
  openModal: function() {
    this.refs.modal.open();
    this.setState({
      counter: this.state.counter + 1
    });
  },
  closeModal: function() {
    this.refs.modal.close();
    this.refs.profiles.refreshQueries();
  }
});

Parse.$ = jQuery;
Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu",
    "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");

React.render(<Example />, document.getElementById('jqueryexample'));
