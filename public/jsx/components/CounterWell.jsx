define(['react'], function(React){
  return React.createClass({
    render: function(){
      return (
        <span
          className="label label-default" >Count: {this.props.count}</span>
      );
    }
  });
});
