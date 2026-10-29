//

export type FormState = {error: string | null }

export type Entry = {
    id?: number
    date : string
    task : string
    hours : number
    notes? : string | null
}

export const entries: Entry[] = [

    {date : "2026-10-26", task: "study", hours : 1},
    {date : "2026-10-26", task : "setup", hours :2},
    {date : "2026-10-26", task: "typeScript", hours : 3.5},
    {date : "2026-10-26", task: "typeScript", hours : 1},
    
]

export function totalHours(entries: Entry[]): number {
    let total = 0 
    for (const entry of entries) {
        total = total + entry.hours
}
return total

}

export function hoursByTask(entries: Entry[]): Record<string, number>{ 
    const totals: Record<string, number> = {}
    for (const entry of entries) {
        totals[entry.task] =(totals[entry.task] ?? 0) + entry.hours
    }
return totals
}

export function hoursByDate(entries : Entry[]): Record<string, number>{
    const totals: Record<string, number> = {}
    for (const entry of entries){
        totals[entry.date] =(totals[entry.date] ?? 0) + entry.hours
    } 

return totals

}

export function checkHours(hours: number): string | null {
    
if (hours <= 0)
    return "Hours must be more than 0"
if (hours <= 0)
    return "Hours must be more than 0"
if (hours > 24)
    return " Nobody works more than 24 hours in a day."

    return null
}
