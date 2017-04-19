import {fromJS, Map} from "immutable"

const CATEGORIES = "categories"
const SUB_CATEGORIES = "subCategories"

export const VALUE = "value"
export const DISPLAY_TEXT = "displayText"

// Marketing
export const MARKETING = "MARKETING"
// Marketing Categories
export const MARKETING_AD_TECH = "AD_TECH"
export const MARKETING_AGENCIES = "AGENCIES"
export const MARKETING_DATA = "DATA"
export const MARKETING_DESIGN = "DESIGN"
export const MARKETING_EMAIL = "EMAIL"
export const MARKETING_OFFLINE = "OFFLINE"
export const MARKETING_SEARCH = "SEARCH"
export const MARKETING_SOCIAL = "SOCIAL"
export const MARKETING_WILD_CARD = "WILD_CARD"
// Marketing subCategories
// Ads
export const AD_SERVERS = "AD_SERVERS"
export const AD_NETWORKS = "AD_NETWORKS"
export const EXCHANGES = "EXCHANGES"
export const RETARGETING = "RETARGETING"
export const MEASUREMENT = "MEASUREMENT"
// Social
export const SOCIAL_MARKETING_MANAGEMENT = "SOCIAL_MARKETING_MANAGEMENT"
export const UGC_MANAGEMENT = "UGC_MANAGEMENT"
export const ADVOCATE_PLATFORMS = "ADVOCATE_PLATFORMS"
export const AFFILLIATE_PROGRAMS = "AFFILLIATE_PROGRAMS"
export const PUBLISHER_TOOLS = "PUBLISHER_TOOLS"

// SEARCH
export const SEO = "SEO"
export const SEM = "SEM"
export const SEARCH_ANALYTICS = "SEARCH_ANALYTICS"

// DATA
export const DATA_MANAGEMENT_PLATFORMS = "DATA_MANAGEMENT_PLATFORMS"
export const DATA_SUPPLIER_PLATFORMS = "DATA_SUPPLIER_PLATFORMS"
export const CONSUMER_INSIGHTS = "CONSUMER_INSIGHTS"
export const PREDICTIVE_PLATFORMS = "PREDICTIVE_PLATFORMS"
export const CRM = "CRM"

// AGENCIES
export const MEDIA_PLANNING = "MEDIA_PLANNING"
export const ADVERTISING = "ADVERTISING"
export const PUBLIC_RELATIONS = "PUBLIC_RELATIONS"
export const SEARCH = "SEARCH"
export const RESEARCH = "RESEARCH"

// DESIGN
export const CREATION_TOOLS = "CREATION_TOOLS"
export const DESIGN_TOOLS = "DESIGN_TOOLS"
export const PROTOTYPING_TOOLS = "PROTOTYPING_TOOLS"

// OFFLINE
export const PRINTING = "PRINTING"
export const EXPERIMENTAL = "EXPERIMENTAL"
export const OUTDOOR_ADVERTISING = "OUTDOOR_ADVERTISING"
export const GUERILLA_MARKETING = "GUERILLA_MARKETING"

//EMAIL
export const EMAIL_SERVICE_PROVIDERS = "EMAIL_SERVICE_PROVIDERS"
export const EMAIL_OPTIMIZATION = "EMAIL_OPTIMIZATION"
export const OUTBOUND_MANAGEMENT = "OUTBOUND_MANAGEMENT"
export const INBOUND_MANAGEMENT = "INBOUND_MANAGEMENT"

//WILD_CARD
export const PROMOTION_PLANNING = "PROMOTION_PLANNING"
export const TRADE_MANAGEMENT = "TRADE_MANAGEMENT"
export const CHANNEL_MANAGEMENT = "CHANNEL_MANAGEMENT"
export const VIDEO_DELIVERY = "VIDEO_DELIVERY"
export const OTHER = "OTHER"

export const INDUSTRY_MARKETING = fromJS({
    [DISPLAY_TEXT]: "Marketing",
    [VALUE]: MARKETING,
    [CATEGORIES]: {
        [MARKETING_AD_TECH]: {
            [VALUE]: MARKETING_AD_TECH,
            [DISPLAY_TEXT]: "Ad Tech",
            [SUB_CATEGORIES]: {
                [AD_SERVERS]: {
                    [VALUE]: AD_SERVERS,
                    [DISPLAY_TEXT]: "Ad Serveres"
                },
                [AD_NETWORKS]: {
                    [VALUE]: AD_NETWORKS,
                    [DISPLAY_TEXT]: "Ad Networks"
                },
                [EXCHANGES]: {
                    [VALUE]: EXCHANGES,
                    [DISPLAY_TEXT]: "Exchanges"
                },
                [RETARGETING]: {
                    [VALUE]: RETARGETING,
                    [DISPLAY_TEXT]: "Retargeting"
                },
                [MEASUREMENT]: {
                    [VALUE]: MEASUREMENT,
                    [DISPLAY_TEXT]: "Measurement"
                },
            }
        },
        [MARKETING_SOCIAL]: {
            [VALUE]: MARKETING_SOCIAL,
            [DISPLAY_TEXT]: "Social",
            [SUB_CATEGORIES]: {
                [SOCIAL_MARKETING_MANAGEMENT]: {
                    [VALUE]: SOCIAL_MARKETING_MANAGEMENT,
                    [DISPLAY_TEXT]: "Social Marketing Management"
                },
                [UGC_MANAGEMENT]: {
                    [VALUE]: UGC_MANAGEMENT,
                    [DISPLAY_TEXT]: "UGC Management"
                },
                [ADVOCATE_PLATFORMS]: {
                    [VALUE]: ADVOCATE_PLATFORMS,
                    [DISPLAY_TEXT]: "Advocate Platforms"
                },
                [AFFILLIATE_PROGRAMS]: {
                    [VALUE]: AFFILLIATE_PROGRAMS,
                    [DISPLAY_TEXT]: "Affilliate Programs"
                },
                [PUBLISHER_TOOLS]: {
                    [VALUE]: PUBLISHER_TOOLS,
                    [DISPLAY_TEXT]: "Publisher Tools"
                }
            }
        },
        [MARKETING_SEARCH]: {
            [VALUE]: MARKETING_SEARCH,
            [DISPLAY_TEXT]: "Search",
            [SUB_CATEGORIES]: {
                [SEO]: {
                    [VALUE]: SEO,
                    [DISPLAY_TEXT]: "SEO"
                },
                [SEM]: {
                    [VALUE]: SEM,
                    [DISPLAY_TEXT]: "SEM"
                },
                [SEARCH_ANALYTICS]: {
                    [VALUE]: SEARCH_ANALYTICS,
                    [DISPLAY_TEXT]: "Search Analytics"
                },
            }
        },
        [MARKETING_DATA]: {
            [VALUE]: MARKETING_DATA,
            [DISPLAY_TEXT]: "Data",
            [SUB_CATEGORIES]: {
                [DATA_MANAGEMENT_PLATFORMS]: {
                    [VALUE]: DATA_MANAGEMENT_PLATFORMS,
                    [DISPLAY_TEXT]: "Data Management Platforms"
                },
                [DATA_SUPPLIER_PLATFORMS]: {
                    [VALUE]: DATA_SUPPLIER_PLATFORMS,
                    [DISPLAY_TEXT]: "Data Supplier Platforms"
                },
                [CONSUMER_INSIGHTS]: {
                    [VALUE]: CONSUMER_INSIGHTS,
                    [DISPLAY_TEXT]: "Consumer Insights"
                },
                [PREDICTIVE_PLATFORMS]: {
                    [VALUE]: PREDICTIVE_PLATFORMS,
                    [DISPLAY_TEXT]: "Predictive Platforms"
                },
                [CRM]: {
                    [VALUE]: CRM,
                    [DISPLAY_TEXT]: "CRM"
                },
            }
        },
        [MARKETING_AGENCIES]: {
            [VALUE]: MARKETING_AGENCIES,
            [DISPLAY_TEXT]: "Agencis",
            [SUB_CATEGORIES]: {
                [MEDIA_PLANNING]: {
                    [VALUE]: MEDIA_PLANNING,
                    [DISPLAY_TEXT]: "Media Planning"
                },
                [ADVERTISING]: {
                    [VALUE]: ADVERTISING,
                    [DISPLAY_TEXT]: "Advertising"
                },
                [PUBLIC_RELATIONS]: {
                    [VALUE]: PUBLIC_RELATIONS,
                    [DISPLAY_TEXT]: "Public Relations"
                },
                [SEARCH]: {
                    [VALUE]: SEARCH,
                    [DISPLAY_TEXT]: "Search"
                },
                [RESEARCH]: {
                    [VALUE]: RESEARCH,
                    [DISPLAY_TEXT]: "Research"
                },
            }
        },
        [MARKETING_DESIGN]: {
            [VALUE]: MARKETING_DESIGN,
            [DISPLAY_TEXT]: "Design",
            [SUB_CATEGORIES]: {
                [CREATION_TOOLS]: {
                    [VALUE]: CREATION_TOOLS,
                    [DISPLAY_TEXT]: "Creation Tools"
                },
                [DESIGN_TOOLS]: {
                    [VALUE]: DESIGN_TOOLS,
                    [DISPLAY_TEXT]: "Design Tools"
                },
                [PROTOTYPING_TOOLS]: {
                    [VALUE]: PROTOTYPING_TOOLS,
                    [DISPLAY_TEXT]: "Prototyping Tools"
                },
            }
        },
        [MARKETING_OFFLINE]: {
            [VALUE]: MARKETING_OFFLINE,
            [DISPLAY_TEXT]: "Offline",
            [SUB_CATEGORIES]: {
                [PRINTING]: {
                    [VALUE]: PRINTING,
                    [DISPLAY_TEXT]: "Printing"
                },
                [EXPERIMENTAL]: {
                    [VALUE]: EXPERIMENTAL,
                    [DISPLAY_TEXT]: "Experimental"
                },
                [OUTDOOR_ADVERTISING]: {
                    [VALUE]: OUTDOOR_ADVERTISING,
                    [DISPLAY_TEXT]: "Outdoor Advertising"
                },
                [GUERILLA_MARKETING]: {
                    [VALUE]: GUERILLA_MARKETING,
                    [DISPLAY_TEXT]: "Guerilla Marketing"
                },
            }
        },
        [MARKETING_EMAIL]: {
            [VALUE]: MARKETING_EMAIL,
            [DISPLAY_TEXT]: "Email",
            [SUB_CATEGORIES]: {
                [EMAIL_SERVICE_PROVIDERS]: {
                    [VALUE]: EMAIL_SERVICE_PROVIDERS,
                    [DISPLAY_TEXT]: "Email Service Providers"
                },
                [EMAIL_OPTIMIZATION]: {
                    [VALUE]: EMAIL_OPTIMIZATION,
                    [DISPLAY_TEXT]: "Email Optimization"
                },
                [OUTBOUND_MANAGEMENT]: {
                    [VALUE]: OUTBOUND_MANAGEMENT,
                    [DISPLAY_TEXT]: "Outbound Management"
                },
                [INBOUND_MANAGEMENT]: {
                    [VALUE]: INBOUND_MANAGEMENT,
                    [DISPLAY_TEXT]: "Inbound Managemtn"
                },
            }
        },
        [MARKETING_WILD_CARD]: {
            [VALUE]: MARKETING_WILD_CARD,
            [DISPLAY_TEXT]: "Wild Card",
            [SUB_CATEGORIES]: {
                [PROMOTION_PLANNING]: {
                    [VALUE]: PROMOTION_PLANNING,
                    [DISPLAY_TEXT]: "Promotion Planning"
                },
                [TRADE_MANAGEMENT]: {
                    [VALUE]: TRADE_MANAGEMENT,
                    [DISPLAY_TEXT]: "Trade Management"
                },
                [CHANNEL_MANAGEMENT]: {
                    [VALUE]: CHANNEL_MANAGEMENT,
                    [DISPLAY_TEXT]: "Channel Management"
                },
                [VIDEO_DELIVERY]: {
                    [VALUE]: VIDEO_DELIVERY,
                    [DISPLAY_TEXT]: "Video Delivery"
                },
                [OTHER]: {
                    [VALUE]: OTHER,
                    [DISPLAY_TEXT]: "Other"
                },
            }
        }
    }
})

export const INDUSTRY_MAP = fromJS({
    [MARKETING]: INDUSTRY_MARKETING
})

export const getCategoryOptions = (industry=MARKETING) => {
    return INDUSTRY_MAP.getIn([industry, CATEGORIES])
}

export const getCategoryDisplayName = (industry=MARKETING, category) => {
    return INDUSTRY_MAP.getIn([industry, CATEGORIES, category, DISPLAY_TEXT])
}

export const getSubCategoryDisplayName = (industry=MARKETING, category, subCategory) => {
    return INDUSTRY_MAP.getIn([industry, CATEGORIES, category, SUB_CATEGORIES, subCategory, DISPLAY_TEXT])
}

export const getSubCategoryOptions = (category, industry=MARKETING) => {
    return getCategoryOptions().getIn([category, SUB_CATEGORIES], Map({}))
}

export const getIndustry = (input) => {
    return INDUSTRY_MAP.get(input)
}

export const getIndustryDisplayName = (input) => {
    if (!input){
        return null;
    }
    let found = INDUSTRY_MAP.find(industry => industry.get(VALUE) == input)
    if (found){
        return found.get(DISPLAY_TEXT)
    }
    return null
}
