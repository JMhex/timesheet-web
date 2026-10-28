
// app/page.tsx
import {Tracker} from "@/components/Tracker"

export default function Home(){
    return (
        <main className="mx-auto grid max-w-xl gap-6 p-8">
        <h1 className="text-2xl font-bold">My timesheet</h1>
        <Tracker />
        </main>
    )
}
