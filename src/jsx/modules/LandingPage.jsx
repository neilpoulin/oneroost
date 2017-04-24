import React, { PropTypes } from "react"
import Logo from "Logo"
import {connect} from "react-redux"
import {Link, withRouter } from "react-router"
import TermsOfServiceLink from "TermsOfServiceLink"
import {joinWaitlist, setEmail} from "ducks/landingpage"
import RoostNav, {TRANSPARENT_STYLE, LIGHT_FONT_STYLE, DARK_FONT_HOVER_STYLE} from "RoostNav"

const LandingPage = withRouter(React.createClass({
    PropTypes: {location: PropTypes.object.isRequired},
    componentDidMount(){
        document.title = "OneRoost"
    },
    render () {
        const {
            email,
            heroTitle,
            heroSubTitle,
            ctaSubText,
            ctaButtonText,
            paragraphs,
            isSuccess,
            isError,
            hasMore,
            submitDisabled,
            invalidEmail,
            //actions
            setEmail,
            signUp,
        } = this.props

        const $footer = <div className="container">
            &copy; 2017 OneRoost | <TermsOfServiceLink text="Terms of Service"/>
        </div>

        var page =
        <div className={"LandingPage"} >
            <section className="background-primary textured">
                <RoostNav
                    loginOnly={true}
                    backgroundStyle={TRANSPARENT_STYLE}
                    fontStyle={LIGHT_FONT_STYLE}
                    fontHoverStyle={DARK_FONT_HOVER_STYLE}
                    regButtonType={"outline-white"}
                    fixed={false}
                    />
                <div className="container">
                    <div className="logoContainer">
                        <Logo/>
                    </div>

                    <div className="heroContainer" display-if={heroTitle}>
                        <h1>{heroTitle}</h1>
                        <p className="tagline" display-if={heroSubTitle}>{heroSubTitle}</p>
                    </div>
                    <div className="emailContainer form-group" display-if={ctaButtonText}>
                        <input type="email"
                            value={email}
                            placeholder={"Email Address"}
                            className={`${invalidEmail ? "has-error" : ""}`}
                            name="email"
                            autoComplete={"email"}
                            onChange={({target}) => setEmail(target.value)}
                            >
                        </input>
                        <button onClick={signUp}
                            className={`btn btn-outline-white ${submitDisabled ? "disabled": ""}`}
                            disabled={submitDisabled}
                            >{ctaButtonText}
                        </button>
                    </div>
                    <div display-if={ctaSubText} className={`actionSubTextContainer ${ isError ? "error" : ""} ${isSuccess ? "success" : ""}`}>
                        {ctaSubText}
                    </div>
                </div>
                <div className="hasMoreContainer" display-if={hasMore && false}>
                    <div className="hasMore">
                        <i className="fa fa-arrow-down fa-3x"></i>
                    </div>
                </div>
                <footer display-if={!hasMore} className="">
                    {$footer}
                </footer>
            </section>
            <section className="textInfo background-light" display-if={paragraphs && paragraphs.length > 0}>
                {paragraphs.map(({title, content}, i) =>
                <div className="info" key={`content_${i}`}>
                    <h3 className="title">{title}</h3>
                    <p className="content">
                        {content}
                    </p>
                </div>
            )}
        </section>
        <footer className="background-primary" display-if={hasMore}>
            {$footer}
    </footer>
</div>
        return page;
    }
}))

const mapStateToProps = (state, ownProps) => {
    const landingPage = state.landingpage.toJS()
    let {
        email,
        heroTitle,
        heroSubTitle,
        ctaSubText,
        ctaButtonText,
        paragraphs,
        isLoading,
        isSaving,
        error,
        success,
    } = landingPage

    const isError = !!error
    const isSuccess = !!success
    if (error){
        ctaSubText = error.message
    }
    else if (success){
        ctaSubText = success.message
    }
    let submitDisabled = isSaving || !email
    let invalidEmail = error && error.field == "email"
    const hasMore = paragraphs && paragraphs.length > 0
    return {
        email,
        heroTitle,
        heroSubTitle,
        ctaSubText,
        ctaButtonText,
        paragraphs,
        isError,
        isSuccess,
        isLoading,
        hasMore,
        submitDisabled,
        invalidEmail
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setEmail: (email) => {
            dispatch(setEmail(email))
        },
        signUp: (email) => {
            dispatch(joinWaitlist(email))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)
