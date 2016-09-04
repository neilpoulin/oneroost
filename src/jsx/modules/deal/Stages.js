/* global Map*/
const stages = new Map([
    ["EXPLORE", {
        value: "EXPLORE",
        label: "Opportunity Exploration",
        description: "Qualifying pain points, defining success, inviting participants, getting budgets, locking down timelines",
        visible: true,
        order: 0
    }],
    ["DETAILS", {
        value: "DETAILS",
        label: "Diving into the Details",
        description: "Presenting the solution (proposal), customizing solution set, deal positioning, demoing, ROI models",
        visible: true,
        order: 1
    }],
    ["APPROVALS", {
        value: "APPROVALS",
        label: "Business Approvals",
        description: " Budget confirmation, legal approval, light negotiation, establish implementation process",
        visible: true,
        order: 2
    }],
    ["IMPLEMENT", {
        value: "IMPLEMENT",
        label: "Implementation",
        description: "Hand offs, integrations, etc...",
        visible: false,
        order: 3
    }]
])

export default stages;
