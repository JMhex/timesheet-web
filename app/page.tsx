
// app/page.tsx
import { EntryList } from "@/components/EntryList"
import { totalHours,hoursByTask, type Entry } from "@/lib/timesheet"


const entries : Entry[] = [
    {date: "2026-10-27", task: "setup", hours: 2},
    {date: "2026-10-27", task: "Next.js", hours: 3.5},
    {date: "2026-10-27", task: "study", hours: 4}
    
]

const taskTotals = Object.entries(hoursByTask(entries))

export default function Home(){
    return (
        <main className="mx-auto grid max-w-xl gap-6 p-8">
        <h1 className="text-2xl font-bold">My timesheet</h1>
        <EntryList entries={entries} />
        <p className="font-bold">Total: {totalHours(entries)} 
        h</p>
        
        <ul className = "divide-y rounded border" >
          {taskTotals.map(([task, hours]) => (
            <li key={task} className="flex justify-between p-3">
              <span>{task}</span>
              <span>{hours}h</span>
            </li>
          ))}
        </ul>
        </main>
    )
}
