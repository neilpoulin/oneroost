import React, { PropTypes } from "react"
import {connect} from "react-redux"
import {initialState, loadPage} from "ducks/brand"
import LoadingTakeover from "LoadingTakeover"
import TemplateLink from "TemplateLink"
import {Link} from "react-router"
import FourOhFourPage from "FourOhFourPage"
import {denormalize} from "normalizr"
import * as BrandPageModel from "models/BrandPage"
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
        const {isLoading, logoUrl, templates, pageTitle, error, departmentMap, description, descriptionLabel} = this.props;
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
            <div className="BrandPage">
                <RoostNav backgroundStyle={TRANSPARENT_STYLE} loginOnly={true} fontStyle={DARK_FONT_STYLE} fixed={false}/>
                <div className="container">
                    <div className="header">
                        {$logo}
                        {$title}
                    </div>

                    <div className="intro lead" display-if={description}>
                        <span display-if={descriptionLabel}><b>{descriptionLabel}</b> | </span><span>{description}</span>
                    </div>
                    <div className="departments">
                        {templates.map((template, i) => {
                            let department = departmentMap[template["department"]]
                            return <TemplateLink key={`brand_template_${i}`} department={department} templateId={template["templateId"] || template.objectId} />
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
    const entities = state.entities.toJS()
    const departmentMap = state.config.get("departmentMap")
    .sort((d1, d2) => {
        return d1.get("displayText").toUpperCase() - d2.get("displayText").toUpperCase()
    })
    .toJS();

    const {brandsByUrl} = state;
    const brand = brandsByUrl.get(vanityUrl, initialState).toJS()
    if (brand.isLoading){
        return {isLoading: true}
    }
    let templates = brand.templates;
    if (brand.templateIds && brand.templateIds.length > 0){
        templates = denormalize(brand.templateIds, [BrandPageModel.Schema], entities)
    }

    return {
        vanityUrl,
        isLoading: brand.isLoading || state.config.get("isLoading"),
        logoUrl: brand.logoUrl,
        error: brand.error,
        templates: templates,
        companyName: brand.companyName,
        pageTitle: brand.pageTitle,
        departmentMap,
        description: brand.description,
        descriptionLabel: brand.descriptionLabel,
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
