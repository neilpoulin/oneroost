import Parse from 'parse';
import React from 'react';
import DealPage from 'DealPage';
import TopNav from 'TopNav';
import Deal from '../models/Deal';
import { render } from 'react-dom'


Parse.$ = jQuery;
Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
new Parse.Query(Deal).get(OneRoost.dealId, {
    success: function( deal )
    {
        render(
            <div>
                <TopNav deal={deal} />
                <DealPage deal={deal} />
            </div>
            , document.getElementById('dealPage')
        );
    }
});
