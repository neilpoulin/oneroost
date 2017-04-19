import {getCategoryOptions,
    MARKETING,
    MARKETING_AGENCIES,
    getIndustryDisplayName,
    getIndustry,
    getSubCategoryOptions,
    getCategoryDisplayName,
    getSubCategoryDisplayName,
} from "./TemplateUtil"

test("validate marketing options", () => {
    const industry = MARKETING
    const categories = getCategoryOptions(industry)
    expect(categories).toBeImmutableMap()
    expect(categories.keySeq().size).toBe(9)
    categories.toList()
        .forEach(category => {
            let catJs = category.toJS()
            expect(catJs).toHaveProperty("value")
            expect(catJs).toHaveProperty("displayText")
            expect(catJs).toHaveProperty("subCategories")
            category.get("subCategories").forEach(opt => {
                let optJs = opt.toJS()
                expect(optJs).toHaveProperty("value")
                expect(optJs).toHaveProperty("displayText")
            })
        })
})

test("get industry", () => {
    let marketing = getIndustry("MARKETING")
    expect(marketing).toBeTruthy()
    expect(marketing.get("displayText")).toBe("Marketing")
})

test("get industry display name", () => {
    expect(getIndustryDisplayName(null)).toBeNull()
    expect(getIndustryDisplayName(MARKETING)).toBe("Marketing")
})

test("get subCategory options", () => {
    let subCategories = getSubCategoryOptions("AD_TECH")
    expect(subCategories).toBeTruthy()
    expect(subCategories).toBeImmutableMap()
    expect(subCategories.size).toBeGreaterThan(0)
    expect(subCategories.getIn(["AD_NETWORKS", "displayText"])).toBe("Ad Networks")
    let list = subCategories.toList()
    list.forEach(opt => {
        expect(opt.toJS()).toHaveProperty("value")
        expect(opt.toJS()).toHaveProperty("displayText")
    })
})

test("get category displayName", () => {
    let displayName = getCategoryDisplayName(undefined, "AD_TECH")
    expect(displayName).toBe("Ad Tech")
})

test("get sub category display name", () => {
    let displayName = getSubCategoryDisplayName(undefined, MARKETING_AGENCIES, "MEDIA_PLANNING")
    expect(displayName).toBe("Media Planning")
})
