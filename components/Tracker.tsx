"use client"

import { useState, type FormEvent } from "react"
import { EntryList } from "@/components/EntryList"
import { checkHours, totalHours, type Entry } from "@/lib/timesheet"


//Tracker is a component. Its useState values hold what the user types and adds, 
// and changing them through their setters makes React redraw it. 
// export lets page.tsx import Tracker and show it on the page.”
export function Tracker() {
    const [entries, setEntries] = useState<Entry[]>([])
    const [task, setTask] = useState("") 
    const [hours, setHours] = useState("")
    const [error, setError] = useState<string | null>(null)
    
    function deleteEntry(index: number){
        setEntries(entries.filter((entry, i) => i !== index))


    }
    
    function addEntry(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const problem = task.trim() === "" ? "Task can't be empty." : checkHours(Number(hours))
        if (problem) {
            setError(problem)
            return
        }

        const today = new Date().toLocaleDateString("en-CA")
        setEntries([...entries, { date: today, task, hours: Number(hours) }])
        setTask("")
        setHours("")
        setError(null)
    }

    return (
        <div className="grid gap-4">
            <form onSubmit={addEntry} className="flex flex-wrap items-end gap-2">
                <label className="grid flex-1 text-sm">
                    Task
                    <input 
                    value={task} 
                    onChange={(e) => setTask(e.target.value)} 
                    className="rounded border px-2 py-1" 
                    />
                </label>

                <label className="grid tet-sm">
                    Hours
                    <input 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)} 
                    type="number" 
                    step="0.25" 
                    className="W-24 rounded border px-2 py-1" 
                    />
                </label>

                <button className="round bg-black px-3 py-1 text-white">Add</button>
                {error && <p className="w-full text-red-600">{error}</p>}
            </form>

            <EntryList entries={entries} onDelete={deleteEntry}/>
            <p className="font-bold">Total: {totalHours(entries)} h</p>
        </div>
    )
}
