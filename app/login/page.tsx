import { Suspense } from "react"
import { login, signup } from "./actions"
import {loginWithMicrosoft } from "./actions"

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
    <main className="mx-auto grid max-w-sm gap-4 p-8">
      <h1 className="text-2xl font-bold">Timesheet</h1>
      <form className="grid gap-3">
        <label className= "grid text-sm">
      Name and Surname
      <input name = "full_name" type="full_name" className="rounded border px-2 py-1"/>
        </label>
        <label className="grid text-sm">
          Email
          <input name="email" type="email" required className="rounded border px-2 py-1" />
        </label>
        <label className="grid text-sm">
          Password
          <input name="password" type="password" required minLength={8} className="rounded border px-2 py-1" />
        </label>
        <form action={loginWithMicrosoft}>
          <button className="w-full rounded border p-2">
            Sign in with Microsoft
          </button>
        </form>
        <div className="flex gap-2">
          <button formAction={login} className="rounded bg-green-600 px-3 py-1 text-white">Sign in</button>
          <button formAction={signup} className="rounded border px-3 py-1">Create account</button>
        </div>
      </form>
      <Suspense fallback={null}>
        <Messages searchParams={searchParams} />
      </Suspense>
    </main>
  )
}