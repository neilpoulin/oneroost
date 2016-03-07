import React, { PropTypes } from 'react'
import Parse from 'parse';
import ParseReact from 'parse-react';
import LoadingTakeover from './../util/LoadingTakeover';
import NextStepsBanner from './../nextsteps/NextStepsBanner';
import AddStakeholderButton from './../deal/AddStakeholderButton';
import Comments from './../deal/Comments';
const Deal = React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        return {
            deal: (new Parse.Query("Deal").equalTo('objectId', props.params.dealId ) )
        }
    },
    startCommentResize: function(){
        var component = this;
        component.refs.comments.updateDimensions();
        this.props.commentResizeInterval = setInterval( function(){
            component.refs.comments.updateDimensions();
        }, 100 );
    },
    stopCommentResize: function(){
        clearTimeout( this.props.commentResizeInterval );
        this.refs.comments.updateDimensions();
    },
    render () {
        if ( this.pendingQueries().length > 0 )
        {
            var message = "Loading...";

            if ( this.pendingQueries().indexOf( 'deal' ) == -1 )
            {
                var dealName = this.data.deal[0].dealName;
                message = "Loading " + dealName;
                document.title = "OneRoost Deal Page - " + dealName ;
            }

            return (
                <LoadingTakeover size="3x" message={message} />
            );
        }
        var deal = this.data.deal[0];
        if ( !deal )
        {
            return (
                <div>ERROR</div>
            )
        }
        return (
            <div className="dealPageContainer">
                <div
                    className="container-fluid"
                    id="dealPageContainer">
                    <div className="dealContainer col-md-10 col-md-offset-2 container-fluid">
                        <div className="row-fluid">
                            <div className="deal-top">
                                <h1>
                                    {deal.dealName}
                                </h1>
                                <AddStakeholderButton deal={deal} />
                                <NextStepsBanner deal={deal} />
                            </div>
                        </div>
                        <div className="row-fluid">
                            <Comments ref="comments" deal={deal} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default Deal
