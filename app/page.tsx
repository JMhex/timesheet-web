import { Suspense } from "react"
import { EntryList } from "@/components/EntryList"
import { AddEntryForm } from "@/components/AddEntryForm"
import { createClient } from "@/lib/supabase/server"
import { totalHours, type Entry } from "@/lib/timesheet"

async function Entries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("entries")
    .select("id, date, task, hours, notes")
    .order("date", { ascending: false })

  if (error) {
    return <p>Could not load entries: {error.message}</p>
  }
  const entries: Entry[] = data ?? []

  return (
    <>
      <EntryList entries={entries} />
      <p className="font-bold">Total: {totalHours(entries)} h</p>
    </>
  )
}

export default function Home() {
  return (
    <main className="mx-auto grid max-w-xl gap-6 p-8">
      <h1 className="text-2xl font-bold">TimeSheet for JM</h1>
      <AddEntryForm/>
      <Suspense fallback={<p>Loading entries…</p>}>
        <Entries />
      </Suspense>
    </main>
  )
}