import {describe, expect, it } from "vitest"
import { checkHours, hoursByTask, totalHours } from "./timesheet"

describe("totalHours", () => {
    it("adds up all entries", () => { 
    const entries = [
        { date: "2026-10-26", task: "Setup", hours: 2.5 },
        { date: "2026-10-26", task: "TypeScript", hours: 3},
    ]
    expect(totalHours(entries)).toBe(5.5)
})

it("is zero for no entries", () => {
    expect(totalHours([])).toBe(0)
})
})

describe("hoursByTask", () => {
    it("adds same entries together", () => {
        const entries = [
            {date: "2026-10-26", task: "SQL", hours: 2},
            {date: "2026-10-27", task: "SQL", hours: 1.5},
        ]
     expect(hoursByTask(entries)).toEqual({ SQL : 3.5})    
    })

    it("handles multiple tasks", () => {
        const entries = [
            {date: "2026-10-26", task: "SQL", hours: 2},
            {date: "2026-10-27", task: "SQL", hours: 1.5},
            {date: "2026-10-27", task: "Work", hours: 1},
            {date: "2026-10-27", task: "Testing", hours: 0.5},
        ]
    expect(hoursByTask(entries)).toEqual({ Work : 1, Testing : 0.5, SQL : 3.5})
    })
})

describe("checkHours", () => {
    it("refuses zero, too many and not-a-number", () => {
        expect(checkHours(0)).not.toBeNull()
        expect(checkHours(25)).not.toBeNull()
        expect(checkHours(Number("abc"))).not.toBeNull()
    })
    it("accepts a normal day", () => {
        expect(checkHours(7.5)).toBeNull()
    })

it("refuses NaN and infinity", () => {
    expect(checkHours(NaN)).not.toBeNull()
    expect(checkHours(Infinity)).not.toBeNull()
    expect(checkHours(-Infinity)).not.toBeNull()
})
})