import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import Deal from './../models/Deal';
import Account from './../models/Account';
import Menu from './sidebar/Menu';
import MenuItem from './sidebar/MenuItem';
import ProfileSidebar from './deal/ProfileSidebar';

export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(){
        var user = Parse.User.current();
        return {

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


            </nav>
        )
    }
});
