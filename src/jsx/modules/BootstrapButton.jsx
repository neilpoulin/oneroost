import React from 'react';

export default React.createClass({
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
