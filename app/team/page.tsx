import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { connection } from "next/server"
import { Suspense } from "react"
 
async function TeamContent (){
await connection()
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    if (!me?.is_admin){
        redirect("/")
    }

    const { data: people } = await supabase.from("profiles").select("id, email")
    const { data: entries } = await supabase.from("entries").select("user_id, hours")

    const totals: Record<string, number> = {}
    for (const entry of entries ?? []) {
        totals[entry.user_id] = (totals[entry.user_id] ?? 0) + entry.hours
    }

    return (
        <main className="mx-auto grid max-w-xl gap-4 p-8">
            <h1 className="text2xl font-bold">Team hours</h1>
            <table className="w-full text-left">
                <thead>
                    <tr><th>Person</th><th>Hours</th></tr>
                </thead>
                <tbody>
                    {(people ?? []).map((person) => (
                        <tr key={person.id}>
                            <td>{person.email}</td>
                            <td>{totals[person.id] ?? 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}


export default function TeamPage(){
        return (
            <Suspense fallback={<p className="p-8">Loading team...</p>}>
            <TeamContent /> 
            </Suspense>
        )
    }