define( ['react', 'sidebar/MenuItem'], function( React, MenuItem ){
    return React.createClass({
        getInitialState: function() {
            return {
                visible: false
            };
        },
        toggle: function()
        {
            this.setState({visible: !this.state.visible});
        },
        show: function() {
            this.setState({ visible: true });
            document.addEventListener("click", this.hide );
        },
        hide: function() {
            document.removeEventListener("click", this.hide );
            this.setState({ visible: false });
        },

        render: function() {
            return <div className="menu">
                <div className={(this.state.visible ? "visible " : "") + this.props.alignment}>{this.props.children}</div>
            </div>;
        }
    });
});
