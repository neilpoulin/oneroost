import React from 'react'
import activeComponent from 'react-router-active-component'

export default React.createClass({
    getDefaultProps: function(){
        return {
            tag: 'li'
        }
    },
    render() {
        var ActiveComponent = activeComponent(this.props.tag);
        return <ActiveComponent {...this.props} activeClassName="active"/>
    }
})
