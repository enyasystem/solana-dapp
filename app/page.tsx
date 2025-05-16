import { LandingHero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { CallToAction } from "@/components/landing/call-to-action"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <LandingHero />
      <Features />
      <CallToAction />
      <Footer />
    </main>
  )
}
