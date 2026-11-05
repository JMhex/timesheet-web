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

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/login")
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
    const { email, password } = readForm(formData)
    const full_name = String(formData.get("full_name") ?? "").trim()
    
    const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name },
        },
    })

    if (error) {
        console.error("signup failed", error)
        redirect("/login?message=" + encodeURIComponent("If that email can be used, you’ll be able to sign in shortly. Check your inbox to continue"))

    }
    if (data.session) {
        redirect("/")


    }
    redirect("/login?message=" + encodeURIComponent("If that email can be used, you’ll be able to sign in shortly. Check your inbox to continue"))
}
