import {
    formatDate,
    formatDateLong,
    formatDateShort,
    isSameDate,
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

describe("isSameDate()", () => {
    test("same datetime", () => {
        let date1 = new Date(time);
        let date2 = new Date(time);
        expect(isSameDate(date1, date2)).toBeTruthy()
    })

    test("same day, differnt time", () => {
        let date1 = new Date("2017-04-14")
        date1.setHours(4)

        let date2 = new Date("2017-04-14")
        date2.setHours(11)
        expect(isSameDate(date1, date2)).toBeTruthy()
    })

    test("differnt days", () => {
        let date1 = new Date("2017-04-14")
        let date2 = new Date("2017-04-16")
        expect(isSameDate(date1, date2)).toBeFalsy()
    })
})
