export const FOREVER = "FOREVER"
export const YEAR = "YEAR"
export const MONTH = "MONTH"
export const DAY = "DAY"

const UNLIMITED_ROOSTS = "Participate in an unlimited number of Roosts"
const RFP_TEMPLATES = "Create and manage unlimited RFP Templates"
const SUPPORT = "Support from the experts at OneRoost"

const freeTrial = {
    duration: 1,
    period: MONTH,
}

export const FREE = {
    stripePlanId: null,
    name: "Free",
    price: 0,
    period: FOREVER,
    features: [UNLIMITED_ROOSTS, "Free, forever"],
}

export const MONTHLY_USER = {
    stripePlanId: "MONTHLY_PER_USER",
    name: "Monthly",
    price: 15,
    period: MONTH,
    freeTrial: null,
    features: [UNLIMITED_ROOSTS, RFP_TEMPLATES, SUPPORT],
}

export const YEARLY_USER = {
    stripePlanId: "YEARLY_PER_USER",
    name: "Yearly",
    price: 150,
    period: YEAR,
    freeTrial,
    features: [UNLIMITED_ROOSTS, RFP_TEMPLATES, SUPPORT, "Best Value"],
}
