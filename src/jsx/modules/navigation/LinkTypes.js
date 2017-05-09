export const PARTICIPANTS_SLUG = "participants"
export const STEPS_SLUG = "steps"
export const INVESTMENT_SLUG = "budget"
export const TIMELINE_SLUG = "timeline"
export const DOCUMENTS_SLUG = "documents"
export const REQUIREMENTS_SLUG = "requirements"

export const PARTICIPANT_TYPE = "participant"
export const STEP_TYPE = "step"
export const INVESTMENT_TYPE = "investment"
export const TIMELINE_TYPE = "timeline"
export const DOCUMENT_TYPE = "document"
export const REQUIREMENT_TYPE = "requirement"

export const LINK_TYPE_OPTIONS = [
    {
        displayText: "Participant",
        value: PARTICIPANT_TYPE
    },
    {
        displayText: "Next Step",
        value: STEP_TYPE
    },
    {
        displayText: "Investment",
        value: INVESTMENT_TYPE
    },
    {
        displayText: "Timeline",
        value: TIMELINE_TYPE
    },
    {
        displayText: "Document",
        value: DOCUMENT_TYPE
    },
    {
        displayText: "Requirement",
        value: REQUIREMENT_TYPE
    }
].sort((opt1, opt2) => opt1.displayText.toUpperCase().localeCompare(opt2.displayText.toUpperCase()))

export const getSlugFromType = (type) => {
    let path = "/"
    if (!type) return path
    switch (type.toLowerCase()) {
        case STEP_TYPE:
            path = STEPS_SLUG
            break;
        case PARTICIPANT_TYPE:
            path = PARTICIPANTS_SLUG
            break;
        case INVESTMENT_TYPE:
            path = INVESTMENT_SLUG
            break;
        case TIMELINE_TYPE:
            path = TIMELINE_SLUG
            break;
        case DOCUMENT_TYPE:
            path = DOCUMENTS_SLUG
            break;
        case REQUIREMENT_TYPE:
            path = REQUIREMENTS_SLUG
        default:
            break;
    }
    return path
}

export const getUrl = (navLink, dealId) => {
    const {type, id} = navLink
    let slug = getSlugFromType(type)
    let link = `/roosts/${dealId}/${slug}`
    if (id){
        link != `/${id}`
    }
    return link;
}
