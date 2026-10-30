//AddEntryForm.tsx

"use client"

import { useActionState } from "react"
import { addEntry } from "@/app/actions"

export function AddEntryForm() {
    const [state, formAction, pending] = useActionState(addEntry, { error: null })

    return(
    <form action={formAction} className="flex flex-wrap items-end gap-2">
        <label className="grid flex-1 text-sm">
            Task
            <input name="task" required className="rounded border px-2 py-1" />
        </label>
        <label className="grid flex-1 text-sm">
            Notes
            <input name = "notes" className="rounded border px-2 py-1"/>
        </label>
        <label className="grid text-sm">
            Hours
            <input name="hours" type="number" step="0.25" min="0.25" max="24" required className="w-24 rounded border px-2 py-1" />
        </label>
        <button disabled={pending} className="rounded bg-green-600 px-3 py-1 text-black disabled:opacity-50">
            {pending ? "saving..." : "Add"}
        </button>
        {state.error && <p className="w-full text-red-600">{state.error}</p>}
    </form>
)
}