import { Suspense } from "react"
import { login, signup } from "./actions"
import {loginWithMicrosoft } from "./actions"
import CastleBackground from "@/lib/CastleBackground"
import Wizard from "@/lib/Wizard"

async function Messages({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
    </>
  )
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  return (
    <>
    <CastleBackground /> 
    <Wizard className="fixed bottom-[3vh] left-[8vw] hidden sm:block" />
    
    <main className="mx-auto mt-16 grid max-w-sm gap-4 rounded-lg bg-black/70 p-8 backdrop-blue-sm">
      <h1 className="text-2xl font-bold">Timesheet</h1>
      <form className="grid gap-3">
        <label className= "grid text-sm">

      Name and Surname
      <input name = "full_name" type="text" className="rounded border px-2 py-1"/>
        </label>
        <label className="grid text-sm">
          Email
          <input name="email" type="email" required className="rounded border px-2 py-1" />
        </label>
        <label className="grid text-sm">
          Password
          <input name="password" type="password" required minLength={8} className="rounded border px-2 py-1" />
        </label>
        
        <div className="flex gap-2">
          <button formAction={login} className="rounded bg-green-600 px-3 py-1 text-white">Sign in</button>
          <button formAction={signup} className="rounded border px-3 py-1">Create account</button>
        </div>
      </form>

<div className="relative">
          <form action={loginWithMicrosoft} className="mt-3" > 
          <button className="w-full rounded border p-2">Sign in with Microsoft</button>
          </form>
        </div>

      <Suspense fallback={null}>
        <Messages searchParams={searchParams} />
      </Suspense>
    </main>
    </>
  )
}