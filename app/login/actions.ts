//app/login/actions.task

"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function readForm(formData: FormData,) {
    return {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
}
}

export async function login(formData: FormData) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword(readForm(formData))
    if (error) {
        redirect("/login?error=" + encodeURIComponent("Wrong email or password"))
    }
    redirect("/")
}

export async function signup(formData: FormData){
    const supabase = await createClient()
    const {data, error} = await supabase.auth.signUp(readForm(formData))
    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message))
    }
    if (data.session) {
        redirect("/")
    }
    redirect("/login?error=" + encodeURIComponent("check your email for a confirmation link, then sign in"))
}

export async function logout() {
    const supabase =await createClient()
    await supabase.auth.signOut()
}