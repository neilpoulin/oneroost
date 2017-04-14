import {getCategoryOptions,
    MARKETING,
    getCategoryDisplayName,
    getCategory,
    getSubCategoryOptions
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

test("get category", () => {
    let marketing = getCategory("MARKETING")
    expect(marketing).toBeTruthy()
})

test("get category display name", () => {
    expect(getCategoryDisplayName(null)).toBeNull()
    expect(getCategoryDisplayName(MARKETING)).toBe("Marketing")
})

test("get subCategory options", () => {
    let subCategories = getSubCategoryOptions("AD_TECH")
    expect(subCategories).toBeTruthy()
    expect(subCategories).toBeImmutableMap()
    expect(subCategories.size).toBeGreaterThan(0)
    expect(subCategories.getIn(["AD_NETWORKS", "displayText"])).toBe("Ad Networks")
})
