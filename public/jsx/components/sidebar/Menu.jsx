define( ['react', 'sidebar/MenuItem', 'jquery'], function( React, MenuItem, $ ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        getInitialState: function() {
            return {
                visible: this.props.visible ? true : false,
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
            var search = null;
            if ( this.props.showSearch )
            {
                search =
                    <div className="menu-search">
                        <div className="form-group">
                            <div className="inner-addon left-addon">
                                <div className="inner-addon {this.props.side}-addon"><i className="fa fa-search"></i></div>
                                <input type="text" className="form-control" placeholder="search" onKeyUp={this.doFilter} valueLink={this.linkState('filterTerm')} />
                            </div>
                        </div>
                    </div>
                ;
            }

            return (
                <div className="menu">
                    <div className={(this.state.visible ? "visible " : "") + this.props.alignment}>
                        {search}
                        {this.props.children}
                    </div>
                </div>
            );
        }
    });
});
