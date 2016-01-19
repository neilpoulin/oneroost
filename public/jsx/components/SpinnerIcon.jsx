define( ['react'], function(React){
  return React.createClass({
    getInitialState: function(){
      return {
        isVisible: false,
        isSpinning: true
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
        <i className={'fa fa-spinner ' + (this.state.isSpinning ? 'fa-spin ' : '') + (this.state.isVisible ? '' : 'hidden ')}></i>
      );
    }
  });
});
