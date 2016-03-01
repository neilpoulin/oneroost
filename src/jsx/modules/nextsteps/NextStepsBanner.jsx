import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import AddNextStepButton from './AddNextStepButton';
import NextStepItem from './NextStepItem';

export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
        return {
            nextSteps: new Parse.Query('NextStep').equalTo( 'deal', this.props.deal ).ascending('dueDate')
        };
    },
    getInitialState: function(){
        return {
            deal: this.props.deal,
            user: Parse.User.current()
        };
    },
    render: function(){
        var addButton = (null);
        var self = this;
        if ( this.data.nextSteps.length < 5 )
        {
            addButton = (
                <div className="addNextStepBannerContainer">
                    <AddNextStepButton deal={self.state.deal} />
                </div>
            );
        }

        return (
            <div id="NextStepsBannerContainer" className="">
                    {this.data.nextSteps.map(function(step){
                        return (
                            <NextStepItem
                                step={step}
                                deal={self.state.deal}
                                key={"deal_" + self.state.deal.objectId + "step_" + step.objectId} >
                            </NextStepItem>
                        );
                    })}
                    {addButton}
            </div>
        );
    }
});
