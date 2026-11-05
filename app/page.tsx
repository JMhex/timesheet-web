import { Suspense } from "react"
import { EntryList } from "@/components/EntryList"
import { AddEntryForm } from "@/components/AddEntryForm"
import { createClient } from "@/lib/supabase/server"
import { totalHours, type Entry } from "@/lib/timesheet"
import { redirect } from "next/navigation"
import { logout } from "@/app/login/actions"
import { connection } from "next/server"

async function UserBar () {
  await connection()
  const supabase = await createClient()
  const {data: { user }, } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")   
  }
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()


return (
  <form action ={logout} className="text-sm">
    {profile?.full_name || user.email} . <button className="underline">Sign out</button>
  </form>
)
}

async function Entries() {
  await connection()
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("entries")
    .select("id, date, task, hours, notes")
    .order("date", { ascending: false })
    .order("id", { ascending: false })

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

async function Notice({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string}>
}) {
  const { notice } = await searchParams
  return notice ? <p className="rounded bg-yellow-100 p-2 text-black">{notice}</p> : null
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise <{ notice?: string }>
}) {
  return (
    <main className="mx-auto grid max-w-xl gap-6 p-8">

      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">TimeSheet for JM</h1>
      
      <Suspense fallback={null}>
        <UserBar />
      </Suspense>
    </header>

   <Suspense fallback={null}>
        <Notice searchParams={searchParams} />
      </Suspense>

      <AddEntryForm />
      <Suspense fallback={<p>Loading entries...</p>}>
        <Entries />
      </Suspense>
    </main>
  )
}