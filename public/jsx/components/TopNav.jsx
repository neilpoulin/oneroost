define(['react', 'parse', 'parse-react', 'models/Deal', 'models/Account', 'sidebar/Menu', 'sidebar/MenuItem'], function( React, Parse, ParseReact, Deal, Account, Menu, MenuItem ){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(){
            var user = Parse.User.current();
            return {
                accounts: (new Parse.Query(Account)).equalTo('createdBy', user ),
                deals: (new Parse.Query(Deal)).equalTo('createdBy', user )
            }
        },
        showLeftMenu: function()
        {
            this.refs.left.show();
        },
        render: function(){
            var accountMap = {};
            _.map(this.data.accounts, function(act){
                accountMap[act.objectId] = act;
            });

            return (
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" onClick={this.showLeftMenu}><i className="fa fa-list"></i> <span className="hidden-xs">Accounts</span> </a>
                        </div>

                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                            </ul>

                            <ul className="nav navbar-nav navbar-right">
                                <li><a href="#">Link</a></li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                                      <ul className="dropdown-menu">
                                            <li><a href="#">Action</a></li>
                                            <li><a href="#">Another action</a></li>
                                            <li><a href="#">Something else here</a></li>
                                            <li role="separator" className="divider"></li>
                                            <li><a href="#">Separated link</a></li>
                                      </ul>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Menu ref="left" alignment="left">
                        {this.data.deals.map(function(deal){
                          return <MenuItem location={"/deals/" + deal.objectId} className="profileCard">
                              <div className="accountName">{accountMap[deal.account.objectId].accountName}</div>
                              <div className="dealName">{deal.dealName}</div>
                              <div className="primaryContact">{accountMap[deal.account.objectId].primaryContact}</div>
                          </MenuItem>
                        })}
                    </Menu>
                </nav>
            )
        }
    });
});
