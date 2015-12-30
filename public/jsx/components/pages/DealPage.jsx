define(['react', 'parse', 'models/Deal', 'deal/Comments', 'deal/Profile', 'next-steps/NextStepsBanner'],
        function( React, Parse, Deal, Comments, DealProfile, NextStepsBanner ){
    return React.createClass({
        getInitialState: function(){
            var component = this;
            return {
                dealId: OneRoost.dealId
            }
        },
        showLeftMenu: function()
        {
            this.refs.left.show();
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
        render: function(){
            var deal = this.props.deal;
            document.title = "OneRoost Deal Page - " + deal.get("dealName");
            var budget = deal.get("budget");

            return(
                <div className="container">
                    <div className="dealContainer">
                        <div className="row">
                            <div className="deal-top container">
                                <h1>{deal.get("dealName")}</h1>
                                <hr/>
                                    <NextStepsBanner deal={deal} ></NextStepsBanner>
                                <hr/>
                            </div>
                            <Comments
                                ref="comments"
                                deal={deal}></Comments>
                        </div>
                    </div>
                </div>
            );
        }
    });
});
