import Header from "@/components/header" // Updated import
import { SustainabilityCalculator } from "@/components/sustainability-calculator"

export default function CalculatorPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header activeLink="dashboard" />
      <main className="flex-1 bg-muted/40">
        <div className="container px-4 py-6 md:px-6 md:py-12">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sustainability Calculator</h1>
              <p className="text-muted-foreground mt-2">
                Calculate your environmental impact and see how your lifestyle choices affect the planet.
              </p>
            </div>
            <SustainabilityCalculator />
          </div>
        </div>
      </main>
    </div>
  )
}
