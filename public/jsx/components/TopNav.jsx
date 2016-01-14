define(['react', 'parse', 'parse-react', 'models/Deal', 'models/Account', 'sidebar/Menu', 'sidebar/MenuItem', 'deal/ProfileSidebar'], function( React, Parse, ParseReact, Deal, Account, Menu, MenuItem, ProfileSidebar ){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(){
            var user = Parse.User.current();
            return {
                accounts: (new Parse.Query(Account)).equalTo('createdBy', user ),
                deals: (new Parse.Query(Deal)).equalTo('createdBy', user )
            }
        },
        showRightMenu: function()
        {
            this.refs.right.show();
        },
        doLogout: function( e ){
            e.preventDefault();
            Parse.User.logOut();
            window.location = "/";
        },
        render: function(){
            var accountMap = {};
            _.map(this.data.accounts, function(act){
                accountMap[act.objectId] = act;
            });
            var deal = this.props.deal;

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
                        </div>

                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                            </ul>

                            <ul className="nav navbar-nav navbar-right">
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i className="fa fa-user"></i> My Profile <span className="caret"></span></a>
                                      <ul className="dropdown-menu">
                                            <li><a href="#" onClick={this.doLogout}>Logout</a></li>
                                            <li role="separator" className="divider"></li>
                                            <li><a href="#">Placeholder Link</a></li>
                                      </ul>
                                </li>
                                <li>
                                    <a className="" onClick={this.showRightMenu}><i className="fa fa-list"></i> <span className="hidden-xs">Deal Info</span> </a>
                                </li>
                            </ul>

                        </div>
                    </div>

                    <Menu ref="right"
                        alignment="right"
                        side="right"
                        showSearch={false} >
                        <ProfileSidebar
                            ref="dealProfile"
                            deal={deal} >
                        </ProfileSidebar>
                    </Menu>
                </nav>
            )
        }
    });
});
