import React, { PropTypes } from 'react'
import Comments from './../deal/Comments';
import DealProfile from './DealProfile';
import FixedSidebar from './FixedSidebar';
import $ from 'jquery';

const DealPageBottom = React.createClass({
    componentDidMount: function(props, state) {
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    },
    componentWillUnmount: function(props, state) {
        window.removeEventListener("resize", this.updateDimensions);
    },
    componentDidUpdate: function(props, state)
    {
        this.updateDimensions();
    },
    updateDimensions: function(){
        var cols = this.props.columns;

        var container = this.refs.DealPageBottom;
        var dealBoundingRect = container.getBoundingClientRect();
        var fixedContainer = this.refs.fixedContainer;
        fixedContainer.style.left = dealBoundingRect.left + "px";
        fixedContainer.style.top = dealBoundingRect.top + "px";
        // fixedContainer.style.width = dealBoundingRect.width + "px";
    },
    render: function() {
        var deal = this.props.deal;
        var totalColumns = 12;
        var commentsColumns = 12;
        var sidebar = (null);
        if ( this.props.children )
        {
            commentsColumns = 8;
            sidebar = (
                <FixedSidebar ref="sidebar" columns={totalColumns - commentsColumns}>
                    {this.props.children}
                </FixedSidebar>
            );
        }
        return (
            <div className="DealPageBottom" ref="DealPageBottom">
                <div className="fixedContainer" ref="fixedContainer">
                    <Comments ref="comments" deal={deal} columns={commentsColumns} />
                    {sidebar}
                </div>
            </div>
        )
    }
})

export default DealPageBottom
