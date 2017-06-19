import React, {PropTypes} from "react"
import {Link} from "react-router"
import {connect} from "react-redux"
import NavLink from "NavLink";
import Bootstrap from "bootstrap";
import {denormalize} from "normalizr"
import * as User from "models/User"

export const DEFAULT_STYLE = "default"
export const TRANSPARENT_STYLE = "transparent"
export const LIGHT_FONT_STYLE = "light"
export const DARK_FONT_STYLE = "dark"
export const DEFAULT_FONT_HOVER_STYLE = "default"
export const DARK_FONT_HOVER_STYLE = "dark"

const RoostNav = React.createClass({
    propTypes: {
        mobileTitle: PropTypes.string,
        showHome: PropTypes.bool,
        showRegister: PropTypes.bool,
        showLogin: PropTypes.bool,
        user: PropTypes.object,
        loginOnly: PropTypes.bool,
        registrationEnabled: PropTypes.bool,
        backgroundStyle: PropTypes.oneOf([DEFAULT_STYLE, TRANSPARENT_STYLE]),
        fontStyle: PropTypes.oneOf([LIGHT_FONT_STYLE, DARK_FONT_STYLE]),
        fontHoverStyle: PropTypes.oneOf([DEFAULT_FONT_HOVER_STYLE, DARK_FONT_HOVER_STYLE]),
        regButtonType: PropTypes.string,
        fixed: PropTypes.bool,
    },
    getDefaultProps: function(){
        return {
            showHome: false,
            showRegister: true,
            showLogin: true,
            mobileTitle: null,
            loginOnly: false,
            registrationEnabled: false,
            backgroundStyle: DEFAULT_STYLE,
            fontStyle: LIGHT_FONT_STYLE,
            fontHoverStyle: DEFAULT_FONT_HOVER_STYLE,
            regButtonType: "primary",
            fixed: true,
        }
    },
    render () {
        const {user, fixed, mobileTitle, loginOnly, showHome, showLogin, showRegister, registrationEnabled, fontStyle, backgroundStyle, fontHoverStyle, regButtonType} = this.props
        let isAdmin = user ? user.admin : false;
        // let plansLink = <NavLink tag="li" to="/plans" className="">Pricing</NavLink>

        var nav =
        <nav className={`navbar navbar-default navbar${fixed? "-fixed" : ""}-top RoostNav ${backgroundStyle} font-${fontStyle} font-hover-${fontHoverStyle}`}>
            <div className="container-fluid" display-if={true}>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link to="/" display-if={!loginOnly} className={"navbar-brand account-link " }><span className="title">OneRoost</span></Link>
                    <div display-if={mobileTitle} className="roost-title hidden-lg hidden-md navbar-brand">{mobileTitle}</div>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav" >
                        <NavLink to="/reporting" display-if={user} >Reporting</NavLink>
                        <NavLink to="/roosts" display-if={user}>Opportunities</NavLink>
                        <NavLink tag="li" to="/help" display-if={!loginOnly} className="">Help</NavLink>
                    </ul>
                    <Link to="/signup" className={`btn btn-${regButtonType} navbar-btn navbar-right`} display-if={showRegister && !user && registrationEnabled}>Sign Up</Link>

                    <ul className="nav navbar-nav navbar-right" >
                        <NavLink tag="li" to="/admin" display-if={isAdmin}>Admin</NavLink>
                        <NavLink to ="/login" display-if={showLogin && !user}>Log In</NavLink>
                        <li className="dropdown" display-if={user}>
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                                aria-expanded="false">
                                <i className="fa fa-user"></i> {user.firstName + " " + user.lastName} <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <NavLink to="/settings/profile">My Account</NavLink>
                                <NavLink to="/settings/company">Company Settings</NavLink>
                                <NavLink to="/settings/brand-page">Brand Page Settings</NavLink>
                                <li role="separator" className="divider"></li>
                                <NavLink to="/logout">Logout</NavLink>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>;

        return nav;
    }
})

const mapStateToProps = (state, ownProps) => {
    let user = state.user.get("userId");
    let entities = state.entities.toJS()
    let registrationEnabled = state.config.get("registrationEnabled", false)

    if (user){
        user = denormalize(user, User.Schema, entities)
    }
    return {
        user: user,
        registrationEnabled,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoostNav)
