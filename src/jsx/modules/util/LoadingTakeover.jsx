import React from 'react';

export default React.createClass(
    {
        getDefaultProps : function() {
            return {
                "size" : "",
                "message"  : "Loading..."
            };
        },
        render: function(){
            var sizeClass = this.props.size ? "fa-" + this.props.size : "";
            return (
                <div className="LoadingTakeover">
                    <div>
                        <i className={"fa fa-spinner fa-spin " + sizeClass}></i>
                        <div className="lead">{this.props.message}</div>
                    </div>
                </div>
            );
        }
    });
