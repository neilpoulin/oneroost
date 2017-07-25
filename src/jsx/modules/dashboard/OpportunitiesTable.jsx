import React from "react"
import PropTypes from "prop-types"
import * as RoostUtil from "RoostUtil"
import TableHeader from "TableHeader"
import TableRow from "TableRow"
import {denormalize} from "normalizr"
import {connect} from "react-redux"
import * as Requirement from "models/Requirement"
import * as Template from "models/Template"
import _ from "lodash"
import moment from "moment"
import * as log from "LoggingUtil"
import {convertArrayOfObjectsToCSV} from "DataUtil"
import {formatDateShort} from "DateUtil"
import * as Deal from "models/Deal"

const RFP_TITLE = "RFP Title"

const headers = [
    {
        label: "Company",
        clickable: false,
        sortable: false,
    },
    {
        label: "Category",
        clickable: false,
        sortable: false,
    },
    {
        label: "Owner",
        clickable: false,
        sortable: false,
    },
    {
        label: "Last Activity",
        clickable: false,
        sortable: false,
    },
    {
        label: "Created",
        clicable: false,
        sortable: false,
    },
    {
        label: "Budget",
        clickable: false,
        sortable: false,
    },
    {
        label: "Status",
        clickable: false,
        sortable: false,
    }
]

const OpportunitiesTable = React.createClass({
    propTypes: {
        opportunities: PropTypes.arrayOf(PropTypes.shape({
            deal: PropTypes.object,
            stakeholders: PropTypes.arrayOf(PropTypes.object),
            comments: PropTypes.arrayOf(PropTypes.object),
            documents: PropTypes.arrayOf(PropTypes.object),
        })),
        currentUser: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired,
        exportCsvData: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    },
    getDefaultProps() {
        return {
            opportunities: []
        }
    },
    componentWillUpdate(nextProps, nextState){
        const oldOpps = this.props.opportunities;
        const {opportunities=[]} = nextProps;
        if (opportunities.length === oldOpps.length){
            return
        }

        nextProps.exportCsvData(nextProps.csvData)
    },
    render () {
        const {
            opportunities,
            currentUser,
            headings,
            requirementHeadings,
            showRequirements,
            isLoading,
            departmentMap,
        } = this.props
        if (isLoading){
            return null
        }
        return (
            <table className="table OpportunitiesTable">
                <TableHeader columns={headings} />
                <tbody>
                    {opportunities.map((opp, i) => {
                        return <TableRow opportunity={opp}
                            key={"opportunities_table_row_" + i}
                            currentUser={currentUser} showRequirements={showRequirements}
                            requirementHeadings={requirementHeadings}
                            departmentMap={departmentMap} />
                    })}
                </tbody>
            </table>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    let currentUser = RoostUtil.getCurrentUser(state)
    let userId = currentUser.objectId;
    let entities = state.entities.toJS()
    let dashboard = state.dashboard.toJS()
    let {selectedTemplateId} = dashboard
    let departmentMap = state.config.get("departmentMap")
    let query = dashboard.searchTerm
    let isLoading = dashboard.isLoading
    let allOpportunities = denormalize(Object.keys(dashboard.roosts), [Deal.Schema], entities).map(deal => ({
        deal,
        ...dashboard.roosts[deal.objectId]
    }))
    let requirementIds = Object.values(entities.requirements).filter(req => Object.keys(dashboard.roosts).indexOf(req.deal) != -1)
    let requirements = denormalize(requirementIds, [Requirement.Schema], entities)
    let deals = denormalize(Object.keys(dashboard.roosts), [Deal.Schema], entities)
    let requirementsByDealId = requirements.reduce((group, req) => {
        let dealId = req.deal.objectId
        let reqs = group[dealId] || []
        reqs.push(req)
        group[dealId] = reqs
        return group
    }, {})

    let headings = headers
    let requirementHeadings = []
    let showRequirements = false
    let showArchived = dashboard.showArchived
    deals.forEach(deal => {
        let roost = dashboard.roosts[deal.objectId]
        roost.status = deal.status;
    })
    if (!showArchived){
        allOpportunities = allOpportunities.filter(opp => !opp.archived)
    }

    if (selectedTemplateId){
        // let selectedTemplateId = selectedTemplate.objectId
        let selectedTemplate = denormalize(selectedTemplateId, Template.Schema, entities)
        showRequirements = true
        allOpportunities = allOpportunities.filter(opp => {
            return opp.deal.template && opp.deal.template.objectId === selectedTemplateId
        })
        headings = headings.filter(h => {
            return h.label !== RFP_TITLE
        })

        if (selectedTemplate.requirements){
            selectedTemplate.requirements.forEach(req => {
                let header = {
                    label: req.title,
                    clickable: false,
                    sortable: false,
                }
                headings.push(header)
                requirementHeadings.push(header)
            })
            allOpportunities.forEach(opp => {
                opp.requirements = requirementsByDealId[opp.dealId] || []
            })
        }
    }

    if (query != null && query.trim().length > 0){
        query = query.trim().replace(/ +(?= )/g, "");
        let patterns = query.split(" ").map(word => new RegExp(_.escapeRegExp(word), "i"))

        allOpportunities = allOpportunities.filter(opp => {
            let {deal} = opp
            let fields = []
            fields.push(deal.dealName)
            fields.push(deal.description)
            fields.push(RoostUtil.getRoostDisplayName(deal, currentUser))
            let searchScore = fields.reduce((fieldScore, field) => {
                return fieldScore + patterns.reduce((patScore, pat) => {
                    return patScore + (pat.test(field) ? 1 : 0)
                }, 0)
            }, 0)
            opp.searchScore = searchScore;
            return searchScore > 0;
        })
        allOpportunities = allOpportunities.sort((a, b) => {
            return b.searchScore - a.searchScore
        })
    }
    else {
        // Sort by activity date:
        allOpportunities = allOpportunities.sort((a, b) => {
            return moment(b.deal.lastActiveAt).diff(moment(a.deal.lastActiveAt))
        })
    }

    let args = []
    if (currentUser){
        args = {data: allOpportunities.map(opp => {
            let requirementData = {}
            requirementHeadings.map(heading => {
                if (!opp.requirements) return
                let requirement = opp.requirements.find(req => {
                    return req.title.trim().toLowerCase() === heading.label.trim().toLowerCase()
                })
                requirementData["\"" + heading.label + "\""] = requirement && requirement.completedDate ? true : false
            })
            const {deal} = opp
            return {
                "company": "\"" + RoostUtil.getRoostDisplayName(opp.deal, currentUser) + "\"",
                "budget (low)": "\"" + deal.budget.low + "\"",
                "budget (high)": "\"" + deal.budget.high + "\"",
                "problem statement": "\"" + deal.dealName + "\"",
                "last activity": "\"" + formatDateShort(deal.lastActiveAt || deal.updatedAt) + "\"",
                "last active user": "\"" + (deal.lastActiveUser ? RoostUtil.getFullName(deal.lastActiveUser) : "") + "\"",
                "created": "\"" + deal.createdAt + "\"",
                ...requirementData,
                "Template Name": deal.template ? "\"" + opp.deal.template.title + "\"" : "",
                "Category": `"${deal.departmentCategory}"`,
                "Sub-Category": `"${deal.departmentSubCategory}"`
            }
        })}
    }
    //TODO: this doesn't work well if there is only 1 opportunity
    let data = convertArrayOfObjectsToCSV(args)
    return {
        opportunities: allOpportunities,
        userId,
        currentUser,
        headings,
        requirementHeadings,
        showRequirements,
        csvData: data,
        isLoading: isLoading || !currentUser,
        departmentMap,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunitiesTable)
