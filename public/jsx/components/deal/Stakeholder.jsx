define([ 'underscore', 'react', 'parse', 'models/Deal'], function( _, React, Parse, Deal ){
    return React.createClass({
        mixins: [React.addons.LinkedStateMixin],
        deleteStakeholder: function( stakeholder ){
            this.props.onDelete( this.props.stakeholder );
        },
        render: function(){
            var stakeholder = this.props.stakeholder;
            return (
                <li data-name={stakeholder.name} data-email={stakeholder.email} className="hover-effects" >
                    {stakeholder.name} (<a href={'mailto:' + stakeholder.email} target="_blank">{stakeholder.email}</a>)
                    <i className="fa fa-times hover-show delete-icon" onClick={this.deleteStakeholder}></i>
                </li>
            );
        }
    });
});
