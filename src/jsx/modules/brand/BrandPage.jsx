import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {initialState, loadPage} from "ducks/brand"
import LoadingTakeover from "LoadingTakeover"
import TemplateLink from "TemplateLink"
import {Link} from "react-router"
import FourOhFourPage from "FourOhFourPage"
import RoostNav, {TRANSPARENT_STYLE, DARK_FONT_STYLE} from "RoostNav"

const BrandPage = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            vanityUrl: PropTypes.string.isRequired
        }),
    },
    componentDidMount(){
        this.props.load();
    },
    componentWillUpdate(){
        document.title = this.props.companyName ? this.props.companyName + " | OneRoost" : "Opportunities | OneRoost";
    },
    render () {
        const {isLoading, logoUrl, templates, pageTitle, error, departmentMap} = this.props;
        if (error){
            return <FourOhFourPage/>
        }

        if (isLoading){
            return <LoadingTakeover/>
        }
        let $title = null
        if (pageTitle){
            $title = <span className="title">{pageTitle}</span>
        }
        let $logo = null
        if (logoUrl){
            $logo = <img src={logoUrl} className="brandLogo"></img>
        }

        return (
            <div>
                <RoostNav backgroundStyle={TRANSPARENT_STYLE} loginOnly={true} fontStyle={DARK_FONT_STYLE}/>
                <div className="BrandPage container">
                    <div className="header">
                        {$logo}
                        {$title}
                    </div>

                    <div className="intro lead">
                        <b>Vendors </b>| Begin proposal process by selecting the department most relevant to your offering
                    </div>
                    <div className="departments">
                        {templates.map((template, i) => {
                            let department = departmentMap[template["department"]]
                            return <TemplateLink key={`brand_template_${i}`} department={department} templateId={template["templateId"]} />
                        })}
                    </div>
                    <footer>
                        <Link to={"/"} className="roostLink">Powered By <span className="logo">OneRoost</span></Link>
                    </footer>
                </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const {params} = ownProps;
    const vanityUrl = params.vanityUrl

    const departmentMap = state.config.get("departmentMap")
    .sort((d1, d2) => {
        return d1.get("displayText").toUpperCase() - d2.get("displayText").toUpperCase()
    })
    .toJS();

    const {brandsByUrl} = state;
    const brand = brandsByUrl.get(vanityUrl, initialState).toJS()
    return {
        vanityUrl,
        isLoading: brand.isLoading || state.config.get("isLoading"),
        logoUrl: brand.logoUrl,
        error: brand.error,
        templates: brand.templates,
        companyName: brand.companyName,
        pageTitle: brand.pageTitle,
        departmentMap,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const vanityUrl = ownProps.params.vanityUrl;
    return {
        load: () => {
            dispatch(loadPage(vanityUrl))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandPage)
