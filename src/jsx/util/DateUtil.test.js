import {
    formatDate,
    formatDateLong,
    formatDateShort
} from "./DateUtil"

const time = 1492154939533; // april 14, 2017 ~1:30am MT

describe("formatDate()", () => {
    test("from time", () => {
        let date = new Date(time);
        expect(formatDate(date)).toBe("Apr 14, 2017")
    })
})

describe("formatDateLong()", () => {
    test("from time", () => {
        let date = new Date(time);
        expect(formatDateLong(date)).toBe("Friday, April 14th, 2017")
    })
})

describe("formatDateShort()", () => {
    test("from time", () => {
        let date = new Date(time);
        expect(formatDateShort(date)).toBe("2017-04-14")
    })
})
