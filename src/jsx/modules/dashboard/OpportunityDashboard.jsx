import Parse from "parse"
import React, {PropTypes} from "react"
import { connect } from "react-redux"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import BetaUserWelcome from "BetaUserWelcome"
import {loadOpportunities, subscribeOpportunities} from "ducks/opportunities"
import {setShowArchived, searchOpportunities, setTemplateId} from "ducks/dashboard"
import OpportunitiesTable from "OpportunitiesTable"
import ToggleButton from "ToggleButton"
import LoadingIndicator from "LoadingIndicator"
import SearchInput from "SearchInput"
import * as RoostUtil from "RoostUtil"
import {loadTemplates} from "ducks/userTemplates"
import * as Template from "models/Template"
import * as Deal from "models/Deal"
import {denormalize} from "normalizr"

const OpportunityDashboard = React.createClass({
    propTypes: {
        showTable: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        currentUser: PropTypes.object,
        templates:  PropTypes.arrayOf(PropTypes.object),
        templatesLoading: PropTypes.bool,
        archivedTemplates: PropTypes.arrayOf(PropTypes.object)
    },
    componentDidMount(){
        this.props.loadData()
    },
    render () {
        const {showTable,
            userId,
            isLoading,
            setShowArchived,
            showArchived,
            hasArchivedDeals,
            currentUser,
            templates,
            templatesLoading,
            archivedTemplates,
            selectedTemplateId,
            selectedTemplate,
            doSearch} = this.props
        let contents = null
        if ( isLoading ){
            contents = <LoadingIndicator message="Loading Dashboard" size="large"/>
        }
        else if ( !showTable ){
            contents = <BetaUserWelcome userId={userId} templates={templates} templatesLoading={templatesLoading} archivedTemplates={archivedTemplates}/>
        }
        else{
            contents = <OpportunitiesTable userId={userId} currentUser={currentUser} template={selectedTemplate}/>
        }

        let toggleArchivedButton = null
        if ( hasArchivedDeals){
            toggleArchivedButton =
            <ToggleButton
                label={"Show Archived: " + (showArchived ? "on" : "off")}
                onClick={setShowArchived}
                activeType="link"
                className="btn-sm"
                inactiveType={"link"}
                block={false}
                active={showArchived} />
        }
        let templateSelector = null
        if ( templates ){
            templateSelector =
            <select className="TemplateSelector" onChange={e => this.props.setTemplateId(e.target.value)} value={selectedTemplateId || ""}>
                <option value="">-- Show All --</option>
                {templates.map(template => {
                    return <option key={"template_selector_" + template.objectId} value={template.objectId} >{template.title}</option>
                })}
            </select>
        }

        return (
            <div className="OpportunityDashboard">
                <RoostNav showHome={false}/>
                <div className="secondaryNav container">
                    <h2 className="hidden-sm hidden-xs">Dashboard</h2>
                    <div className="actions">
                        {templateSelector}
                        <SearchInput
                            onKeyUp={doSearch}
                            onSearch={doSearch}
                            />
                        {toggleArchivedButton}
                        <AddAccountButton
                            onSuccess={this.afterAddAccount}
                            btnClassName="btn-outline-primary btn-sm"
                            />
                    </div>

                </div>
                <div className="dashboard-body container table-responsive">
                    {contents}
               </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    let dashboard = state.dashboard.toJS()
    let currentUser = RoostUtil.getCurrentUser(state)
    const templatesByUser = state.templatesByUser.toJS()
    let userId = currentUser.objectId
    let myOpportunities = state.opportunitiesByUser.get(userId)
    const entities = state.entities.toJS()
    let isLoading = true
    let showTable = false
    let hasArchivedDeals = false
    let templates = []

    if ( myOpportunities ){
        myOpportunities = myOpportunities.toJS()
        isLoading = myOpportunities.isLoading
        showTable = myOpportunities.deals.length > 0 || myOpportunities.archivedDeals.length > 0
        hasArchivedDeals = myOpportunities.archivedDeals.length > 0
        let deals = denormalize( myOpportunities.deals, [Deal.Schema], entities)
        templates = deals.filter(deal => !!deal.template).map(deal => deal.template)
    }

    const myTemplates = templatesByUser[userId]

    let templatesLoading = false;

    let archivedTemplates = []
    let selectedTemplate = null
    let selectedTemplateId = dashboard.selectedTemplateId
    if ( myTemplates ){
        templatesLoading = myTemplates.isLoading;
        templates = templates.concat(denormalize(myTemplates.templateIds, [Template.Schema], entities))
        archivedTemplates = denormalize(myTemplates.archivedTemplateIds, [Template.Schema], entities)
    }
    if ( selectedTemplateId ){
        selectedTemplate = denormalize(selectedTemplateId, Template.Schema, entities)
    }


    return {
        showTable,
        currentUser,
        userId,
        isLoading,
        showArchived: dashboard.showArchived,
        selectedTemplateId,
        selectedTemplate,
        hasArchivedDeals,
        templates,
        templatesLoading,
        archivedTemplates
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const currentUser = Parse.User.current()
    const userId = currentUser.id
    return {
        loadData: () => {
            dispatch(loadOpportunities(userId))
            dispatch(subscribeOpportunities(userId))
            dispatch(loadTemplates(userId))
        },
        setShowArchived: (show) => {
            dispatch(setShowArchived(show))
        },
        doSearch: (query) => {
            dispatch(searchOpportunities(query))
        },
        setTemplateId: (templateId) => {
            dispatch(setTemplateId(templateId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunityDashboard)
