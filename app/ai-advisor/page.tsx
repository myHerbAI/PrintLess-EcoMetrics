import { AiAdvisor } from "@/components/ai-advisor"

export default function AiAdvisorPage() {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Sustainability Advisor</h1>
        <p className="text-muted-foreground">
          Get personalized sustainability recommendations and insights powered by AI
        </p>
      </div>

      <AiAdvisor />
    </div>
  )
}
