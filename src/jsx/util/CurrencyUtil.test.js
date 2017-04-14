import {formatMoney, getBudgetString} from "./CurrencyUtil"

describe("formatMoney()", () => {
    test("small values", () => {
        expect(formatMoney(12.99)).toBe("13")
    })

    test("millions", () => {
        expect(formatMoney(1200500)).toBe("1.2m")
    })

    test("include currency sympol", () => {
        expect(formatMoney(3500, true)).toBe("$3.5k")
    })
})

describe("getBudgetString()", () => {
    test("getBudgetString with valid, existing budget", () => {
        let deal = {budget: {
            low: 10,
            high: 50
        }}
        expect(getBudgetString(deal)).toBe("$10 - 50")
    })
})
