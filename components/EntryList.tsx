// components/EntryList.tsx

import type { Entry } from "@/lib/timesheet"

export function EntryList ({ entries, onDelete }: {entries: Entry[], onDelete?: (index: number) => void }) {
    if (entries.length === 0) {
        return <p className="text-gray-500">No entries yet.</p>
    }

return (
    <ul className="divide-y rounded border">
        {entries.map((entry, index) => (
            <li key={entry.id ?? index} className="grid grid-cols-[1fr_2fr_auto] items-center gap-4 p-3">
                <span>{entry.task}</span>
                <span className="text-center text-gray-500">{entry.notes}</span>
                <span className="text-right">{entry.hours} h</span>
                {onDelete && <button onClick={() => onDelete(index)}>Delete</button>}
            </li>
        ))}
    </ul>
)
}