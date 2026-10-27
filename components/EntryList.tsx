// components/EntryList.tsx

import type { Entry } from "@/lib/timesheet"

export function EntryList ({ entries }: {entries: Entry[] }) {
    if (entries.length === 0) {
        return <p className="text-gray-500">No entries yet.</p>
    }

return (
    <ul className="divide-y rounded border">
        {entries.map((entry, index) => (
            <li key={index} className="flex justify-between p-3">
                <span>{entry.task}</span>
                <span>{entry.hours} h </span>
            </li>
        ))}
    </ul>
)
}