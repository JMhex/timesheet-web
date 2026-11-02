"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { checkHours, type FormState } from "@/lib/timesheet"

export async function deleteEntry(formData: FormData){
    const id = Number(formData.get("id"))
    const supabase = await createClient()
    await supabase.from("entries").delete().eq("id", id)
    revalidatePath("/")
}

export async function addEntry(_previous: FormState, formData: FormData): Promise<FormState> {
    const task = String(formData.get("task") ?? "").trim()
    const hours = Number(formData.get("hours"))
    const notes = String(formData.get("notes") ?? "").trim() || null

    
    const values ={
        task,
        hours: String(formData.get("hours") ?? ""),
        notes: notes ?? "",
    }

    const problem = task === "" ? "Task can't be empty." : checkHours(hours)
    if (problem){
        return { error: problem}
    }

    const supabase = await createClient()
    const { error } = await supabase.from("entries").insert({ task, hours, notes })
    if (error){
        console.error("addEntry: insert failed", error)
        return { error: "Couldn't save that entry. Try again"}
    }


    revalidatePath("/")
    return { error: null }
}