import { Landing } from "@/components/inicio/landing"
import BackgroundPaths from "@/components/inicio/background-paths"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundPaths />
      <Landing />
    </div>
  )
}
