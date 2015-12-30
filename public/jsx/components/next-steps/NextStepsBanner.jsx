define(['react', 'parse', 'parse-react', 'next-steps/AddNextStepButton', 'next-steps/NextStepItem'], function( React, Parse, ParseReact, AddNextStepButton, NextStepItem ){
    return React.createClass({
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
        addNextStep: function(){
            this.refreshQueries('nextSteps');
            this.render();
        },
        removeNextStep: function(){
            this.refreshQueries('nextSteps');
            this.render();
        },
        render: function(){
            var addButton = (null);
            var component = this;
            if ( this.data.nextSteps.length < 5 )
            {
                addButton = (
                    <div className="addNextStepBannerContainer">
                        <AddNextStepButton
                            deal={this.state.deal}
                            addNextStep={this.addNextStep}
                            ></AddNextStepButton>
                    </div>
                );
            }

            return (
                <div id="NextStepsBannerContainer">
                    {this.data.nextSteps.map(function(step){
                        return (
                            <NextStepItem
                                step={step}
                                deleteNextStep={component.removeNextStep}>
                            </NextStepItem>
                        );
                    })}
                    {addButton}
                </div>
            );
        }
    });
});
