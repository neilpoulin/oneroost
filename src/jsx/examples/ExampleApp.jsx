define(['react',
      'examples/BootstrapModal',
      'examples/BootstrapButton',
      'CounterWell',
      'LoginComponent',
      'UserProfileCard',
      'parse',
      'parse-react'],
      function( React,
            BootstrapModal,
            BootstrapButton,
            CounterWell,
            LoginComponent,
            UserProfileCard ){

  return React.createClass({
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

                <BootstrapButton onClick={this.refreshUsers} className="btn-success">
                    Refresh Users
                </BootstrapButton>

                {counterWell}

            </div>
          </div>
          <div className="row">
            <LoginComponent ></LoginComponent>
          </div>
          <div className="row">
            {profiles}
          </div>
        </div>
      );
    },
    refreshUsers: function(){
      this.refs.profiles.refreshQueries();
      this.setState({
        counter: this.state.counter + 1
      });
    },
    openModal: function() {
      this.refs.modal.open();
    },
    closeModal: function() {
      this.refs.modal.close();
    }
  });
});
