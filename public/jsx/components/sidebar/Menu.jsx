define( ['react', 'sidebar/MenuItem', 'jquery'], function( React, MenuItem, $ ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function() {
            return {
                visible: false,
                filterTerm: ""
            };
        },
        toggle: function()
        {
            this.setState({visible: !this.state.visible});
        },
        show: function() {
            this.setState({ visible: true });
            document.addEventListener( "click", this.handleDocumentClick );
        },
        hide: function() {
            document.removeEventListener( "click", this.handleDocumentClick );
            this.setState({ visible: false });
        },
        handleDocumentClick: function( e ){
            if ( !$(e.target).closest( ".menu" ).length )
            {
                this.hide();
            }
        },
        doFilter: function(){
            console.log("filtering: " + this.state.filterTerm );
        },
        render: function() {
            return (
                <div className="menu">
                    <div className={(this.state.visible ? "visible " : "") + this.props.alignment}>
                        <div className="menu-search">
                            <div className="form-group">
                                <div className="inner-addon left-addon">
                                    <div className="inner-addon left-addon"><i className="fa fa-search"></i></div>
                                    <input type="text" className="form-control" placeholder="search" onKeyUp={this.doFilter} valueLink={this.linkState('filterTerm')} />
                                </div>
                            </div>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            );
        }
    });
});
