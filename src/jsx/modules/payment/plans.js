export const FOREVER = "FOREVER"
export const YEAR = "YEAR"
export const MONTH = "MONTH"
export const DAY = "DAY"

export const MONTHLY_USER = {
    stripePlanId: "MONTHLY_PER_USER",
    name: "Monthly",
    price: 15,
    period: MONTH,
    freeTrial: {
        duration: 30,
        period: DAY,
    },
    features: ["feature1", "feature2"],
}

export const YEARLY_USER = {
    stripePlanId: "YEARLY_PER_USER",
    name: "Yearly",
    price: 150,
    period: YEAR,
    freeTrial: {
        duration: 90,
        period: DAY,
    },
    features: ["feature3", "feature4"],
}

export const FREE = {
    stripePlanId: null,
    name: "Free",
    price: 0,
    period: FOREVER,
    features: ["feature3", "feature4"],
}
